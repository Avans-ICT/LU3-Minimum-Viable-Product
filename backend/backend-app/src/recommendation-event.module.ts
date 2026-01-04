import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bullmq";

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

@NestModule({
  imports: [
    HttpModule.register({ timeout: 15000, maxRedirects: 0 }),

    MongooseModule.forFeature([
      { name: RecommendationEventDocument.name, schema: RecommendationEventSchema },
      { name: ModuleEntity.name, schema: ModuleSchema }, // ✅ module model beschikbaar voor processor
    ]),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),

    BullModule.registerQueue({ name: "recommendations" }),
  ],
  controllers: [RecommendationEventController],
  providers: [
    RecommendationEventService,
    RecommendationEventRepository,
    RecommendationJobsProcessor,
    AiServiceClient,
  ],
})
export class RecommendationEventModule {}