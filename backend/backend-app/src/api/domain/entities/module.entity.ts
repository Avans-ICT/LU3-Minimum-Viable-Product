import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'modules' })
export class Module extends Document {
  @Prop({ required: true, unique: true })
  Id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  shortdescription: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  studycredit: number;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  contact_id: number;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  learningoutcomes: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);