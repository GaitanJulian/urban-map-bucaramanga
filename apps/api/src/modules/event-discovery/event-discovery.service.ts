import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { ListEventsQueryDto } from "./dto/list-events.query.dto.js";
import { PublicEventListResponseDto } from "./dto/public-event-list-response.dto.js";
import { PublicEventDto } from "./dto/public-event.dto.js";
import { EventEntity } from "./entities/event.entity.js";

type LifecycleStatus = "upcoming" | "live";

@Injectable()
export class EventDiscoveryService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>
  ) {}

  async listVisibleEvents(query: ListEventsQueryDto): Promise<PublicEventListResponseDto> {
    const page = this.parsePositiveInteger(query.page, 1, "page");
    const pageSize = this.parsePositiveInteger(query.pageSize, 20, "pageSize");
    const skip = (page - 1) * pageSize;
    const now = new Date();

    const qb = this.eventRepository
      .createQueryBuilder("event")
      .innerJoinAndSelect("event.category", "category")
      .innerJoinAndSelect("event.location", "location")
      .leftJoinAndSelect("event.zone", "zone")
      .where("event.visibilityState = :visible", { visible: "visible" })
      .andWhere("event.status IN (:...statuses)", { statuses: ["upcoming", "live"] satisfies LifecycleStatus[] })
      .andWhere("location.cityName = :city", { city: "Bucaramanga" })
      .andWhere("event.endsAt >= :now", { now });

    const appliedFilters: Record<string, unknown> = {
      scope: "Bucaramanga",
      visibilityState: "visible",
      lifecycle: ["upcoming", "live"]
    };

    this.applyCategoryFilter(qb, query, appliedFilters);
    this.applyZoneFilter(qb, query, appliedFilters);
    this.applyDateFilter(qb, query, appliedFilters);
    this.applyCostFilter(qb, query, appliedFilters);
    this.applyProximityFilter(qb, query, appliedFilters);

    const shouldOrderByDistance =
      this.isProvided(query.nearLat) || this.isProvided(query.nearLng) || this.isProvided(query.radiusKm);

    if (!shouldOrderByDistance) {
      qb.orderBy("event.startsAt", "ASC");
    }

    qb.skip(skip).take(pageSize);

    const [events, totalItems] = await qb.getManyAndCount();

    return {
      items: events.map((event) => this.toPublicEvent(event)),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)
      },
      appliedFilters: {
        scope: "Bucaramanga",
        visibilityState: "visible",
        lifecycle: ["upcoming", "live"],
        ...(this.hasText(query.categoryId) ? { categoryId: query.categoryId } : {}),
        ...(this.hasText(query.zoneId) ? { zoneId: query.zoneId } : {}),
        ...(this.hasText(query.dateFrom) ? { dateFrom: query.dateFrom } : {}),
        ...(this.hasText(query.dateTo) ? { dateTo: query.dateTo } : {}),
        ...(this.isProvided(query.isFree) ? { isFree: this.parseBooleanLike(query.isFree, "isFree") } : {}),
        ...(this.hasText(query.cost) ? { cost: query.cost } : {}),
        ...(this.isProvided(query.nearLat) ? { nearLat: this.parseNumber(query.nearLat, "nearLat") } : {}),
        ...(this.isProvided(query.nearLng) ? { nearLng: this.parseNumber(query.nearLng, "nearLng") } : {}),
        ...(this.isProvided(query.radiusKm) ? { radiusKm: this.parsePositiveNumber(query.radiusKm, "radiusKm") } : {}),
        ...(shouldOrderByDistance ? { sort: "distance" } : {})
      }
    };
  }

  private applyCategoryFilter(
    qb: SelectQueryBuilder<EventEntity>,
    query: ListEventsQueryDto,
    appliedFilters: Record<string, unknown>
  ): void {
    if (!this.hasText(query.categoryId)) {
      return;
    }

    qb.andWhere("event.categoryId = :categoryId", { categoryId: query.categoryId });
    appliedFilters.categoryId = query.categoryId;
  }

  private applyZoneFilter(
    qb: SelectQueryBuilder<EventEntity>,
    query: ListEventsQueryDto,
    appliedFilters: Record<string, unknown>
  ): void {
    if (!this.hasText(query.zoneId)) {
      return;
    }

    qb.andWhere("location.zoneId = :zoneId", { zoneId: query.zoneId });
    appliedFilters.zoneId = query.zoneId;
  }

  private applyDateFilter(
    qb: SelectQueryBuilder<EventEntity>,
    query: ListEventsQueryDto,
    appliedFilters: Record<string, unknown>
  ): void {
    if (this.hasText(query.dateFrom)) {
      const dateFrom = this.parseBogotaDateStart(query.dateFrom, "dateFrom");
      qb.andWhere("event.endsAt >= :dateFrom", { dateFrom });
      appliedFilters.dateFrom = query.dateFrom;
    }

    if (this.hasText(query.dateTo)) {
      const dateTo = this.parseBogotaDateEnd(query.dateTo, "dateTo");
      qb.andWhere("event.startsAt <= :dateTo", { dateTo });
      appliedFilters.dateTo = query.dateTo;
    }
  }

  private applyCostFilter(
    qb: SelectQueryBuilder<EventEntity>,
    query: ListEventsQueryDto,
    appliedFilters: Record<string, unknown>
  ): void {
    if (this.isProvided(query.isFree)) {
      const isFree = this.parseBooleanLike(query.isFree, "isFree");
      qb.andWhere("event.isFree = :isFree", { isFree });
      appliedFilters.isFree = isFree;
      return;
    }

    if (!this.hasText(query.cost)) {
      return;
    }

    const cost = query.cost.trim();
    const normalizedCost = cost.toLowerCase();

    if (["free", "gratis", "gratuito", "sin costo", "0"].includes(normalizedCost)) {
      qb.andWhere("event.isFree = :isFree", { isFree: true });
      appliedFilters.isFree = true;
      appliedFilters.cost = cost;
      return;
    }

    if (["paid", "pago"].includes(normalizedCost)) {
      qb.andWhere("event.isFree = :isFree", { isFree: false });
      appliedFilters.isFree = false;
      appliedFilters.cost = cost;
      return;
    }

    qb.andWhere("event.costLabel ILIKE :cost", { cost: `%${cost}%` });
    appliedFilters.cost = cost;
  }

  private applyProximityFilter(
    qb: SelectQueryBuilder<EventEntity>,
    query: ListEventsQueryDto,
    appliedFilters: Record<string, unknown>
  ): void {
    const hasNearLat = this.isProvided(query.nearLat);
    const hasNearLng = this.isProvided(query.nearLng);
    const hasRadius = this.isProvided(query.radiusKm);
    const anyProximityParam = hasNearLat || hasNearLng || hasRadius;

    if (!anyProximityParam) {
      return;
    }

    if (!hasNearLat || !hasNearLng || !hasRadius) {
      throw new BadRequestException("nearLat, nearLng y radiusKm deben enviarse juntos.");
    }

    const nearLat = this.parseNumber(query.nearLat, "nearLat");
    const nearLng = this.parseNumber(query.nearLng, "nearLng");
    const radiusKm = this.parsePositiveNumber(query.radiusKm, "radiusKm");
    const radiusMeters = radiusKm * 1000;

    qb.andWhere(
      "ST_DWithin(location.point_geometry::geography, ST_SetSRID(ST_MakePoint(:nearLng, :nearLat), 4326)::geography, :radiusMeters)",
      {
        nearLat,
        nearLng,
        radiusMeters
      }
    );
    qb.addSelect(
      "ST_Distance(location.point_geometry::geography, ST_SetSRID(ST_MakePoint(:nearLng, :nearLat), 4326)::geography)",
      "distance_meters"
    );
    qb.orderBy("distance_meters", "ASC").addOrderBy("event.startsAt", "ASC");

    appliedFilters.nearLat = nearLat;
    appliedFilters.nearLng = nearLng;
    appliedFilters.radiusKm = radiusKm;
    appliedFilters.sort = "distance";
  }

  private parsePositiveInteger(value: unknown, defaultValue: number, fieldName: string): number {
    if (!this.isProvided(value)) {
      return defaultValue;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException(`${fieldName} debe ser un entero positivo.`);
    }

    return parsed;
  }

  private parsePositiveNumber(value: unknown, fieldName: string): number {
    const parsed = this.parseNumber(value, fieldName);
    if (parsed <= 0) {
      throw new BadRequestException(`${fieldName} debe ser mayor que 0.`);
    }

    return parsed;
  }

  private parseNumber(value: unknown, fieldName: string): number {
    if (!this.isProvided(value)) {
      throw new BadRequestException(`${fieldName} debe ser un numero valido.`);
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      throw new BadRequestException(`${fieldName} debe ser un numero valido.`);
    }

    return parsed;
  }

  private parseBooleanLike(value: unknown, fieldName: string): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (["true", "1", "yes"].includes(normalized)) {
        return true;
      }

      if (["false", "0", "no"].includes(normalized)) {
        return false;
      }
    }

    throw new BadRequestException(`${fieldName} debe ser booleano.`);
  }

  private parseBogotaDateStart(value: string, fieldName: string): Date {
    return this.parseBogotaDateBound(value, fieldName, "start");
  }

  private parseBogotaDateEnd(value: string, fieldName: string): Date {
    return this.parseBogotaDateBound(value, fieldName, "end");
  }

  private parseBogotaDateBound(value: string, fieldName: string, bound: "start" | "end"): Date {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`${fieldName} debe tener formato YYYY-MM-DD.`);
    }

    const suffix = bound === "start" ? "00:00:00.000-05:00" : "23:59:59.999-05:00";
    const date = new Date(`${value}T${suffix}`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${fieldName} no es una fecha valida.`);
    }

    return date;
  }

  private toPublicEvent(event: EventEntity): PublicEventDto {
    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      summary: event.summary,
      category: {
        id: event.category?.id ?? event.categoryId,
        name: event.category?.name ?? ""
      },
      location: {
        label: event.location?.label ?? "",
        addressText: event.location?.addressText ?? "",
        latitude: event.location?.latitude ?? 0,
        longitude: event.location?.longitude ?? 0,
        precisionLevel: event.location?.precisionLevel ?? "approximate",
        approximationNote: event.location?.approximationNote ?? null,
        isApproximateLocation: event.isApproximateLocation
      },
      zone: {
        id: event.zone?.id ?? event.zoneId ?? "",
        name: event.zone?.name ?? ""
      },
      status: event.status,
      visibilityState: event.visibilityState,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      costLabel: event.costLabel,
      isFree: event.isFree,
      isApproximateLocation: event.isApproximateLocation
    };
  }

  private isProvided(value: unknown): boolean {
    return value !== undefined && value !== null && value !== "";
  }

  private hasText(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }
}
