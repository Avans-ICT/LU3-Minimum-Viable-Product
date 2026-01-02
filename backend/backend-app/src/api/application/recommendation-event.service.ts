import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { RecommendationEventRepository } from "../infrastructure/repositories/recommendation-event.repository";
import { RequestRecommendationsDto } from "../domain/dtos/request-recommendations.dto";

@Injectable()
export class RecommendationEventService {
  constructor(
    private readonly repo: RecommendationEventRepository,
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
      // if you want to be strict:
      // throw new ConflictException("requestId already used");
      return existing;
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
}