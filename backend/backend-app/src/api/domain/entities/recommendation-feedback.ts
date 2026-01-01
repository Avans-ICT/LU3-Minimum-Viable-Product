export type FeedbackType = "like" | "dislike" | "rating";

export class RecommendationFeedback {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,

    public readonly moduleId: string,      // ref modules._id
    public readonly feedbackType: FeedbackType,
    public readonly value: number,

    public readonly eventId: string,       // ref recommendation_events._id
    public readonly sessionId: string,
    public readonly userId?: string,       // ref users._id
  ) {}
}