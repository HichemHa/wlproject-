import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;
@Schema({
    validateBeforeSave: true,
})
export class User{
    static email(email: any) {
      throw new Error('Method not implemented.');
    }
    @Prop({ required: true })
    email:string;
    @Prop({ required: true })
    password:string;
}

export const UserSchema = SchemaFactory.createForClass(User)