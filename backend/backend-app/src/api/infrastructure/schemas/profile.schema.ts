import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ collection: "profiles" })
export class ProfileDoc {
  @Prop({ type: Types.ObjectId, required: true, ref: "users" }) user_id!: Types.ObjectId;

  @Prop({ required: true }) study_program!: string;
  @Prop({ required: true }) location!: string;
  @Prop({ required: true }) level!: string;

  @Prop({ type: [String], required: true }) interests!: string[];
  @Prop({ required: true }) updated_at!: Date;
}
export const ProfileSchema = SchemaFactory.createForClass(ProfileDoc);