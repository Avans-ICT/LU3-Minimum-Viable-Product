import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Types } from "mongoose";
import { RecommendationEventRepository } from "../infrastructure/repositories/recommendation-event.repository";
import { RequestRecommendationsDto } from "../domain/dtos/request-recommendations.dto";
import { CreateRecommendationFeedbackDto } from "../domain/dtos/create-recommendation-feedback.dto";
import { RecommendationFeedbackRepository } from "../infrastructure/repositories/recommendation-feedback.repository";

@Injectable()
export class RecommendationEventService {
  constructor(
    private readonly repo: RecommendationEventRepository,
    private readonly feedbackRepo: RecommendationFeedbackRepository,
    @InjectQueue("recommendations")
    private readonly recommendationsQueue: Queue,
  ) {}

  /**
   * Async entrypoint:
   * - creates pending event (idempotent on userId+requestId)
   * - enqueues a background job that will call FastAPI and update the event
   */
  async requestRecommendationsAsync(userId: string, dto: RequestRecommendationsDto) {
    // idempotency: if exists return it
    const existing = await this.repo.findByUserAndRequestId(userId, dto.requestId);
    if (existing) {
      throw new ConflictException("requestId already used");
    }

    // create pending event
    let event;
    try {
      event = await this.repo.createPending({
        userId,
        sessionId: dto.sessionId,
        requestId: dto.requestId,
        k: dto.k,
        inputInterestsText: dto.inputInterestsText,
        constraintsLocation: dto.constraintsLocation,
        constraintsLevel: dto.constraintsLevel,
        constraintsStudycreditsMin: dto.constraintsStudycreditsMin,
        constraintsStudycreditsMax: dto.constraintsStudycreditsMax,
      });
    } catch (e: any) {
      // if unique index hits
      throw new ConflictException("requestId already used");
    }

    // enqueue job
    await this.recommendationsQueue.add(
      "generate",
      {
        eventId: String(event._id),
        userId,
      },
      {
        removeOnComplete: 1000,
        removeOnFail: 5000,
        attempts: 3,
        backoff: { type: "exponential", delay: 1500 },
      },
    );

    return event;
  }

  async getEventById(eventId: string) {
    const event = await this.repo.findById(eventId);
    if (!event) throw new NotFoundException("RecommendationEvent not found");
    return event;
  }

  /**
   * Feedback entrypoint:
   * - verifies event exists + ownership
   * - verifies event has results and is COMPLETED
   * - prevents feedback spam (1 submission per event per user)
   * - validates moduleIds are part of the event results
   * - stores feedback in recommendation_feedback collection
   */
  async submitFeedback(userId: string, eventId: string, dto: CreateRecommendationFeedbackDto) {
    const event = await this.repo.findById(eventId);
    if (!event) throw new NotFoundException("RecommendationEvent not found");

    if (String(event.user_id) !== String(userId)) {
      throw new ForbiddenException("You do not own this recommendation event");
    }

    if (event.status !== "COMPLETED") {
      throw new BadRequestException("Event must be COMPLETED before feedback can be submitted");
    }

    if (!event.results || event.results.length === 0) {
      throw new BadRequestException("Event has no results to give feedback on");
    }

    const userObjectId = new Types.ObjectId(userId);
    const eventObjectId = new Types.ObjectId(eventId);

    const already = await this.feedbackRepo.existsForEvent(userObjectId, eventObjectId);
    if (already) {
      throw new ConflictException("Feedback already submitted for this event");
    }

    const allowedModuleIds = new Set<string>(
      (event.results ?? []).map((r: any) => String(r.module_id)),
    );

    for (const item of dto.items) {
      if (!allowedModuleIds.has(String(item.moduleId))) {
        throw new BadRequestException(`Module ${item.moduleId} is not part of this event results`);
      }
    }

    const records = dto.items.map((i) => ({
      eventId: eventObjectId,
      userId: userObjectId,
      sessionId: dto.sessionId ?? event.session_id,
      moduleId: new Types.ObjectId(i.moduleId),
      feedbackType: i.feedbackType,
      value: i.value,
    }));

    const inserted = await this.feedbackRepo.createMany(records);
    return { insertedCount: inserted.length };
  }
}