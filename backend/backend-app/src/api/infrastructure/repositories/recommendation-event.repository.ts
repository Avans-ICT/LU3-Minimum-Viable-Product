import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RecommendationEventDocument } from "../schemas/recommendation-event.schema";

@Injectable()
export class RecommendationEventRepository {
  constructor(
    @InjectModel(RecommendationEventDocument.name)
    private readonly model: Model<RecommendationEventDocument>,
  ) {}

  async findById(id: string) {
    return this.model.findById(id).lean();
  }

  async findByUserAndRequestId(userId: string, requestId: string) {
    return this.model
      .findOne({ user_id: new Types.ObjectId(userId), request_id: requestId })
      .lean();
  }

  async createPending(input: {
    userId: string;
    sessionId: string;
    requestId: string;
    k: number;
    inputInterestsText: string;
    constraintsLocation?: string;
    constraintsLevel?: string;
    constraintsStudycreditsMin?: number;
    constraintsStudycreditsMax?: number;
  }) {
    const doc = await this.model.create({
      event_type: "recommendation_created",
      created_at: new Date(),
      user_id: new Types.ObjectId(input.userId),
      session_id: input.sessionId,
      request_id: input.requestId,
      algorithm: "pending",
      model_version: "pending",
      k: input.k,
      input_interests_text: input.inputInterestsText,
      constraints_location: input.constraintsLocation,
      constraints_level: input.constraintsLevel,
      constraints_studycredits_min: input.constraintsStudycreditsMin,
      constraints_studycredits_max: input.constraintsStudycreditsMax,
      status: "PENDING",
      results: [],
    });

    return doc.toObject();
  }

  async markCompleted(input: {
    eventId: string;
    algorithm: string;
    modelVersion: string;
    results: Array<{
      moduleId: string;
      rank: number;
      score: number;
      reasons?: Record<string, unknown>;
    }>;
  }) {
    const mappedResults = input.results.map((r) => ({
      module_id: new Types.ObjectId(r.moduleId),
      rank: r.rank,
      score: r.score,
      reasons: r.reasons,
    }));

    await this.model.updateOne(
      { _id: new Types.ObjectId(input.eventId) },
      {
        $set: {
          status: "COMPLETED",
          completed_at: new Date(),
          algorithm: input.algorithm,
          model_version: input.modelVersion,
          results: mappedResults,
          error_message: undefined,
        },
      },
    );
  }

  async markFailed(input: { eventId: string; errorMessage: string }) {
    await this.model.updateOne(
      { _id: new Types.ObjectId(input.eventId) },
      {
        $set: {
          status: "FAILED",
          completed_at: new Date(),
          error_message: input.errorMessage,
        },
      },
    );
  }
}