import { Module } from "@nestjs/common";
import { AuthModule } from "./auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { RecommendationEventModule } from "./recommendation-event.module";
import { ModulesModule } from "./module.module" ;

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 2000,
          limit: 6,
        },
      ],
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    // mongodb
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>("MONGODB_URI"),
      }),
    }),

    AuthModule,
    RecommendationEventModule,
    ModulesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}