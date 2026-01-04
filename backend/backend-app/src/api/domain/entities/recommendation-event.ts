export type RecommendationEventType = "recommendation_created";

export type RecommendationEventStatus = "PENDING" | "COMPLETED" | "FAILED";

export type RecommendationResult = {
  moduleId: string; // ref modules._id
  rank: number;
  score: number;
  reasons?: Record<string, unknown>;
};

export class RecommendationEvent {
  constructor(
    public readonly id: string,
    public readonly eventType: RecommendationEventType,
    public readonly createdAt: Date,

    public readonly userId: string,
    public readonly sessionId: string,
    public readonly requestId: string,

    public readonly algorithm: string,
    public readonly modelVersion: string,

    public readonly k: number,

    public readonly inputInterestsText: string,
    public readonly constraintsLocation?: string,
    public readonly constraintsLevel?: string,
    public readonly constraintsStudycreditsMin?: number,
    public readonly constraintsStudycreditsMax?: number,

    public readonly status: RecommendationEventStatus = "PENDING",
    public readonly completedAt?: Date,
    public readonly errorMessage?: string,

    public readonly results: RecommendationResult[] = [],
  ) {}
}