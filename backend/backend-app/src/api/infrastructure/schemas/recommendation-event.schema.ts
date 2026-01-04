import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ collection: "recommendation_events" })
export class RecommendationEventDocument extends Document {
  @Prop({ required: true })
  event_type!: string;

  @Prop({ required: true, default: () => new Date() })
  created_at!: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: "users" })
  user_id!: Types.ObjectId;

  @Prop({ required: true })
  session_id!: string;

  @Prop({ required: true })
  request_id!: string;

  @Prop({ required: true })
  algorithm!: string;

  @Prop({ required: true })
  model_version!: string;

  @Prop({ required: true })
  k!: number;

  @Prop({ required: true })
  input_interests_text!: string;

  @Prop({ required: false })
  constraints_location?: string;

  @Prop({ required: false })
  constraints_level?: string;

  @Prop({ required: false })
  constraints_studycredits_min?: number;

  @Prop({ required: false })
  constraints_studycredits_max?: number;

  // async fields
  @Prop({ required: true, enum: ["PENDING", "COMPLETED", "FAILED"], default: "PENDING" })
  status!: "PENDING" | "COMPLETED" | "FAILED";

  @Prop({ required: false })
  completed_at?: Date;

  @Prop({ required: false })
  error_message?: string;

  @Prop({
    type: [
      {
        module_id: { type: Types.ObjectId, required: true, ref: "modules" },
        rank: { type: Number, required: true },
        score: { type: Number, required: true },
        reasons: { type: Object, required: false },
      },
    ],
    required: true,
    default: [],
  })
  results!: Array<{
    module_id: Types.ObjectId;
    rank: number;
    score: number;
    reasons?: Record<string, unknown>;
  }>;
}

export const RecommendationEventSchema = SchemaFactory.createForClass(
  RecommendationEventDocument,
);

// Idempotency: voorkom spam/duplicates op dezelfde requestId per user
RecommendationEventSchema.index({ user_id: 1, request_id: 1 }, { unique: true });
