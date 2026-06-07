import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ListEventsQueryDto } from "./dto/list-events.query.dto.js";
import { PublicEventListResponseDto } from "./dto/public-event-list-response.dto.js";
import { EventEntity } from "./entities/event.entity.js";
import { PublicEventDto } from "./dto/public-event.dto.js";

@Injectable()
export class EventDiscoveryService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>
  ) {}

  async listVisibleEvents(query: ListEventsQueryDto): Promise<PublicEventListResponseDto> {
    const page = Math.max(Number(query.page ?? 1), 1);
    const pageSize = Math.max(Number(query.pageSize ?? 20), 1);
    const skip = (page - 1) * pageSize;

    const now = new Date();
    const [events, totalItems] = await this.eventRepository
      .createQueryBuilder("event")
      .innerJoinAndSelect("event.category", "category")
      .innerJoinAndSelect("event.location", "location")
      .leftJoinAndSelect("event.zone", "zone")
      .where("event.visibilityState = :visible", { visible: "visible" })
      .andWhere("event.status IN (:...statuses)", { statuses: ["upcoming", "live"] })
      .andWhere("location.cityName = :city", { city: "Bucaramanga" })
      .andWhere("event.endsAt >= :now", { now })
      .orderBy("event.startsAt", "ASC")
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

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
        lifecycle: ["upcoming", "live"]
      }
    };
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
}
