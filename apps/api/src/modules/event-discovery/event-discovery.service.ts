import { Injectable } from "@nestjs/common";

@Injectable()
export class EventDiscoveryService {
  listVisibleEvents() {
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
