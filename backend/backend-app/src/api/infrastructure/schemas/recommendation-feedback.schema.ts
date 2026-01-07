import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ collection: "recommendation_feedback", timestamps: { createdAt: "created_at", updatedAt: false } })
export class RecommendationFeedbackDocument extends Document {
  @Prop({ type: Types.ObjectId, required: true, ref: "RecommendationEventDocument", index: true })
  event_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: "UserEntity", index: true })
  user_id!: Types.ObjectId;

  @Prop({ type: String, required: false })
  session_id?: string;

  @Prop({ type: Types.ObjectId, required: true, ref: "ModuleEntity", index: true })
  module_id!: Types.ObjectId;

  @Prop({ type: String, required: true, index: true })
  feedback_type!: string;

  @Prop({ type: Number, required: true })
  value!: number;

  @Prop({ type: Date })
  created_at!: Date;
}

export const RecommendationFeedbackSchema = SchemaFactory.createForClass(
  RecommendationFeedbackDocument
);

/**
 * Voorkomt “spammen” van exact dezelfde feedback.
 * (1 user kan per event + module + type maar 1 record maken)
 */
RecommendationFeedbackSchema.index(
  { event_id: 1, user_id: 1, module_id: 1, feedback_type: 1 },
  { unique: true }
);