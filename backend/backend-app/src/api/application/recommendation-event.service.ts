import {
  Injectable,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { RecommendationEventRepository } from "../infrastructure/repositories/recommendation-event.repository";
import { CreateRecommendationEventDto } from "../domain/dtos/create-recommendation-event.dto";
import { RecommendationEvent } from "../domain/entities/recommendation-event";

@Injectable()
export class RecommendationEventService {
  constructor(private readonly repo: RecommendationEventRepository) {}

  async create(dto: CreateRecommendationEventDto): Promise<RecommendationEvent> {
    // Defense-in-depth (DTO should already catch this)
    if (dto.userId && !Types.ObjectId.isValid(dto.userId)) {
      throw new BadRequestException("Invalid userId");
    }

    for (const r of dto.results) {
      if (!Types.ObjectId.isValid(r.moduleId)) {
        throw new BadRequestException("Invalid moduleId");
      }
    }

    try {
      const doc = await this.repo.create({
        // ---- DB fields (snake_case) ----
        event_type: dto.eventType,
        created_at: new Date(),

        session_id: dto.sessionId,
        request_id: dto.requestId,

        algorithm: dto.algorithm,
        model_version: dto.modelVersion,

        k: dto.k,
        alpha: dto.alpha,
        beta: dto.beta,
        input_interests_text: dto.inputInterestsText,

        user_id: dto.userId ? new Types.ObjectId(dto.userId) : undefined,

        constraints_location: dto.constraintsLocation,
        constraints_level: dto.constraintsLevel,
        constraints_studycredits_min: dto.constraintsStudycreditsMin,
        constraints_studycredits_max: dto.constraintsStudycreditsMax,

        results: dto.results.map((r) => ({
          module_id: new Types.ObjectId(r.moduleId),
          rank: r.rank,
          score: r.score,
          reasons: r.reasons,
        })),
      } as any);

      return this.toEntity(doc as any);
    } catch (err: any) {
      // Mongo duplicate key error (idempotency)
      if (err?.code === 11000 && err?.keyPattern?.request_id) {
        throw new ConflictException(
          "Recommendation event already exists for this requestId",
        );
      }
      throw err;
    }
  }

  async findById(id: string): Promise<RecommendationEvent | null> {
    const doc = await this.repo.findById(id);
    return doc ? this.toEntity(doc as any) : null;
  }

  async findLatestByUserId(userId: string): Promise<RecommendationEvent | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid userId");
    }

    const doc = await this.repo.findLatestByUserId(userId);
    return doc ? this.toEntity(doc as any) : null;
  }

  // ---- Mapping DB → Domain Entity ----
  private toEntity(doc: any): RecommendationEvent {
    return new RecommendationEvent(
      String(doc._id),
      doc.event_type,
      doc.created_at,

      doc.algorithm,
      doc.model_version,

      doc.k,
      doc.alpha,
      doc.beta,
      doc.input_interests_text,

      (doc.results ?? []).map((r: any) => ({
        moduleId: String(r.module_id),
        rank: r.rank,
        score: r.score,
        reasons: r.reasons,
      })),

      doc.session_id,
      doc.request_id,
      doc.user_id ? String(doc.user_id) : undefined,

      doc.constraints_location,
      doc.constraints_level,
      doc.constraints_studycredits_min,
      doc.constraints_studycredits_max,
    );
  }
}