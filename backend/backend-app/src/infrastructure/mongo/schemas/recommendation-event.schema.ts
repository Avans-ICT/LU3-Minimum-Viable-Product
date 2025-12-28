import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ collection: "recommendation_events" })
export class RecommendationEventDoc {
  @Prop({ required: true }) event_type!: string;
  @Prop({ required: true }) created_at!: Date;

  @Prop({ type: Types.ObjectId, ref: "users" }) user_id?: Types.ObjectId;
  @Prop({ required: true }) session_id!: string;
  @Prop({ required: true }) request_id!: string;

  @Prop({ required: true }) algorithm!: string;
  @Prop({ required: true }) model_version!: string;

  @Prop({ required: true }) k!: number;
  @Prop({ required: true }) alpha!: number;
  @Prop({ required: true }) beta!: number;
  @Prop({ required: true }) input_interests_text!: string;

  @Prop() constraints_location?: string;
  @Prop() constraints_level?: string;
  @Prop() constraints_studycredits_min?: number;
  @Prop() constraints_studycredits_max?: number;

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
  })
  results!: Array<{
    module_id: Types.ObjectId;
    rank: number;
    score: number;
    reasons?: Record<string, unknown>;
  }>;
}
export const RecommendationEventSchema = SchemaFactory.createForClass(RecommendationEventDoc);