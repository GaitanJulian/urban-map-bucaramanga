import { Module } from "@nestjs/common";
import { GeolocationPlaceService } from "./geolocation-place.service.js";

@Module({
  providers: [GeolocationPlaceService],
  exports: [GeolocationPlaceService]
})
export class GeolocationPlaceModule {}
