import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { RecommendationEventController } from "./api/interface/recommendation-event.controller";
import { RecommendationEventService } from "./api/application/recommendation-event.service";
import { RecommendationJobsProcessor } from "./api/application/recommendation-jobs.processor";
import { RecommendationEventRepository } from "./api/infrastructure/repositories/recommendation-event.repository";
import {
  RecommendationEventDocument,
  RecommendationEventSchema,
} from "./api/infrastructure/schemas/recommendation-event.schema";
import { AiServiceClient } from "./api/infrastructure/http/ai-service.client";

import { Module as ModuleEntity, ModuleSchema } from "./api/infrastructure/schemas/module.schema";
import {
  RecommendationFeedbackDocument,
  RecommendationFeedbackSchema,
} from "./api/infrastructure/schemas/recommendation-feedback.schema";
import { RecommendationFeedbackRepository } from "./api/infrastructure/repositories/recommendation-feedback.repository";
import { LoggerMiddleware } from './api/middleware/logger';

@Module({
  imports: [
    HttpModule.register({ timeout: 15000, maxRedirects: 0 }),

    MongooseModule.forFeature([
      { name: RecommendationEventDocument.name, schema: RecommendationEventSchema },
      { name: ModuleEntity.name, schema: ModuleSchema },
      { name: RecommendationFeedbackDocument.name, schema: RecommendationFeedbackSchema },
    ]),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>("REDIS_HOST") || "localhost";
        const port = Number(config.get<number>("REDIS_PORT")) || 6379;
        const password = config.get<string>("REDIS_PASSWORD");

        const connection: any = { host, port };

        if (password) {
          connection.password = password;
          connection.tls = {}; // SSL alleen inschakelen als er een password is (Upstash)
        }

        return { connection };
      },
    }),
    BullModule.registerQueue({ name: "recommendations" }),
  ],
  controllers: [RecommendationEventController],
  providers: [
    RecommendationEventService,
    RecommendationEventRepository,
    RecommendationFeedbackRepository,
    RecommendationJobsProcessor,
    AiServiceClient,
  ],
})
export class RecommendationEventModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(RecommendationEventController); // alleen voor AuthController
  }
}