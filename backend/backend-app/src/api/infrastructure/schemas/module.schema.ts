import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ModuleDocument = HydratedDocument<Module>;

@Schema({ collection: "modules" })
export class Module {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  shortdescription!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true })
  studycredit!: number;

  @Prop({ required: true })
  location!: string;

  @Prop({ required: true })
  contact_id!: string;

  @Prop({ required: true })
  level!: string;

  @Prop({ type: [String], required: true })
  learningoutcomes!: string[];

  @Prop({ type: [String], required: true })
  module_tags!: string[];

  @Prop({ required: true })
  popularity_score!: number;

  @Prop({ required: true })
  estimated_difficulty!: string;

  @Prop({ required: true })
  available_spots!: number;

  @Prop({ required: true })
  start_date!: Date;

  @Prop({ required: true })
  updated_at!: Date;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);