import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RecommendationFeedbackDocument } from "../schemas/recommendation-feedback.schema";

export type CreateFeedbackRecord = {
  eventId: Types.ObjectId;
  userId: Types.ObjectId;
  sessionId?: string;
  moduleId: Types.ObjectId;
  feedbackType: string;
  value: number;
};

@Injectable()
export class RecommendationFeedbackRepository {
  constructor(
    @InjectModel(RecommendationFeedbackDocument.name)
    private readonly model: Model<RecommendationFeedbackDocument>
  ) {}

  async createMany(records: CreateFeedbackRecord[]) {
    // ordered:false -> als 1 duplicate is, faalt niet alles meteen
    return this.model.insertMany(
      records.map((r) => ({
        event_id: r.eventId,
        user_id: r.userId,
        session_id: r.sessionId,
        module_id: r.moduleId,
        feedback_type: r.feedbackType,
        value: r.value,
      })),
      { ordered: false }
    );
  }

  async existsForEvent(userId: Types.ObjectId, eventId: Types.ObjectId) {
    const count = await this.model.countDocuments({ user_id: userId, event_id: eventId }).exec();
    return count > 0;
  }
}