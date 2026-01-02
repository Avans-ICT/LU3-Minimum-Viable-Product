import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ModuleDocument = HydratedDocument<Module>;

@Schema({ collection: "modules" })
export class Module {
  @Prop({ name: "id", required: true, unique: true })
  legacyId!: number;

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
  contact_id!: number;

  @Prop({ required: true })
  level!: string;

  @Prop({ required: true })
  learningoutcomes!: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

// map legacyId <-> database field "id" (of "Id")
ModuleSchema.set("toObject", { virtuals: true });
ModuleSchema.set("toJSON", { virtuals: true });