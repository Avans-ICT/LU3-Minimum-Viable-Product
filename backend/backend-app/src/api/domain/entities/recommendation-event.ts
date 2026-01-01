export type RecommendationEventType = "recommendation_created";

export type RecommendationResult = {
  moduleId: string;                       // ref modules._id
  rank: number;
  score: number;
  reasons?: Record<string, unknown>;
};

export class RecommendationEvent {
  constructor(
    public readonly id: string,
    public readonly eventType: RecommendationEventType,
    public readonly createdAt: Date,

    public readonly algorithm: string,
    public readonly modelVersion: string,

    public readonly k: number,
    public readonly alpha: number,
    public readonly beta: number,
    public readonly inputInterestsText: string,

    public readonly results: RecommendationResult[],

    public readonly sessionId: string,
    public readonly requestId: string,
    public readonly userId?: string,       // ref users._id

    public readonly constraintsLocation?: string,
    public readonly constraintsLevel?: string,
    public readonly constraintsStudycreditsMin?: number,
    public readonly constraintsStudycreditsMax?: number,
  ) {}
}