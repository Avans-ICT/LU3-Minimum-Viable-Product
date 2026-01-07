import { Types } from "mongoose";

export class RecommendationFeedback {
  _id!: Types.ObjectId;

  createdAt!: Date;

  eventId!: Types.ObjectId;
  userId!: Types.ObjectId;

  sessionId?: string;

  moduleId!: Types.ObjectId;

  feedbackType!: string;
  value!: number;
}