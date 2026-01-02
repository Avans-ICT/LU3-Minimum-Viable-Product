import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RecommendationEventDoc, RecommendationEventSchema } from "./api/infrastructure/schemas/recommendation-event.schema";
import { RecommendationEventRepository } from "./api/infrastructure/repositories/recommendation-event.repository";
import { RecommendationEventService } from "./api/application/recommendation-event.service";
import { RecommendationEventController } from "./api/interface/recommendation-event.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecommendationEventDoc.name, schema: RecommendationEventSchema, collection: "recommendation_events" },
    ]),
  ],
  controllers: [RecommendationEventController],
  providers: [RecommendationEventService, RecommendationEventRepository],
  exports: [RecommendationEventService],
})
export class RecommendationEventModule {}