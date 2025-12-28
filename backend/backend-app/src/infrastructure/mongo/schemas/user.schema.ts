import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "users" })
export class UserDoc {
  @Prop({ required: true, unique: true }) email!: string;
  @Prop({ required: true }) password_hash!: string;
  @Prop({ required: true }) created_at!: Date;
}
export const UserSchema = SchemaFactory.createForClass(UserDoc);