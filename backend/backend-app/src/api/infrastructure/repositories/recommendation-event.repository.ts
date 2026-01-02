import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RecommendationEventDoc } from "../schemas/recommendation-event.schema";

@Injectable()
export class RecommendationEventRepository {
  constructor(
    @InjectModel(RecommendationEventDoc.name)
    private readonly model: Model<RecommendationEventDoc>,
  ) {}

  create(event: Partial<RecommendationEventDoc>) {
    return this.model.create(event);
  }

  findById(id: string) {
    return this.model.findById(id).exec();
  }

  deleteById(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }

  findLatestByUserId(userId: string) {
    return this.model.findOne({ user_id: userId }).sort({ created_at: -1 }).exec();
  }
}