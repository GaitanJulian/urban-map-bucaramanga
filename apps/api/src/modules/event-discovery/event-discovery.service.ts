import { Injectable } from "@nestjs/common";
import { ListEventsQueryDto } from "./dto/list-events.query.dto.js";
import { PublicEventListResponseDto } from "./dto/public-event-list-response.dto.js";

@Injectable()
export class EventDiscoveryService {
  listVisibleEvents(_query: ListEventsQueryDto): PublicEventListResponseDto {
    return {
      items: [],
      pagination: {
        page: 1,
        pageSize: 20,
        totalItems: 0,
        totalPages: 0
      },
      appliedFilters: {}
    };
  }
}
