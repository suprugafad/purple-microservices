import { Document } from 'mongoose';
import { IUser, UserRole } from '@purple-udemy/interfaces';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class User extends Document implements IUser {
  @Prop()
  displayName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.Student,
  })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
