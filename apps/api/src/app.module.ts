import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthModule } from "./health/health.module.js";
import { EventDiscoveryModule } from "./modules/event-discovery/event-discovery.module.js";
import { GeolocationPlaceModule } from "./modules/geolocation-place/geolocation-place.module.js";
import { InfrastructureModule } from "./modules/infrastructure/infrastructure.module.js";
import { SharedModule } from "./modules/shared/shared.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ...(process.env.DB_ENABLED === "false"
      ? []
      : [
          TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              type: "postgres",
              host: config.get<string>("DB_HOST", "localhost"),
              port: config.get<number>("DB_PORT", 5432),
              username: config.get<string>("DB_USER", "postgres"),
              password: config.get<string>("DB_PASSWORD", "postgres"),
              database: config.get<string>("DB_NAME", "urban_map_bucaramanga"),
              autoLoadEntities: true,
              synchronize: false
            })
          })
        ]),
    HealthModule,
    SharedModule,
    InfrastructureModule,
    GeolocationPlaceModule,
    EventDiscoveryModule
  ]
})
export class AppModule {}
