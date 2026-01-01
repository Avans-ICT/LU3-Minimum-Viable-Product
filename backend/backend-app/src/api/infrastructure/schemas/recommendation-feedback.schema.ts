import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ collection: "recommendation_feedback" })
export class RecommendationFeedbackDoc {
  @Prop({ required: true }) created_at!: Date;

  @Prop({ type: Types.ObjectId, required: true, ref: "recommendation_events" })
  event_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "users" }) user_id?: Types.ObjectId;

  @Prop({ required: true }) session_id!: string;

  @Prop({ type: Types.ObjectId, required: true, ref: "modules" })
  module_id!: Types.ObjectId;

  @Prop({ required: true }) feedback_type!: string;
  @Prop({ required: true }) value!: number;
}
export const RecommendationFeedbackSchema = SchemaFactory.createForClass(RecommendationFeedbackDoc);