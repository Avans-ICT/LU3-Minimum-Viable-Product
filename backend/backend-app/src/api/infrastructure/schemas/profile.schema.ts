import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ProfileSchemaClass {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  interests?: string;

  @Prop()
  studycredits?: number;

  @Prop()
  location?: string;

  @Prop()
  level?: string;
}