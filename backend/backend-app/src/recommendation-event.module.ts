import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { BullModule } from "@nestjs/bullmq";
import { ConfigModule, ConfigService } from '@nestjs/config';

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

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('REDIS_HOST') || 'localhost';
        const port = Number(config.get<number>('REDIS_PORT')) || 6379;
        const password = config.get<string>('REDIS_PASSWORD');

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
    RecommendationJobsProcessor,
    AiServiceClient,
  ],
})
export class RecommendationEventModule {}