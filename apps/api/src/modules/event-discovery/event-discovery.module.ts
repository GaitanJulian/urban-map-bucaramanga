import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventDiscoveryController } from "./event-discovery.controller.js";
import { EventDiscoveryService } from "./event-discovery.service.js";
import { EventCategoryEntity } from "./entities/event-category.entity.js";
import { EventEntity } from "./entities/event.entity.js";
import { EventLocationEntity } from "../geolocation-place/entities/event-location.entity.js";
import { ZoneEntity } from "../geolocation-place/entities/zone.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, EventCategoryEntity, EventLocationEntity, ZoneEntity])],
  controllers: [EventDiscoveryController],
  providers: [EventDiscoveryService]
})
export class EventDiscoveryModule {}
