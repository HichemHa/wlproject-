import { User } from './../../users/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';

export type NoteDocument = Note & Document;

@Schema({
  validateBeforeSave: true,
  timestamps: true,
})
export class Note {
  @IsNotEmpty()
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  creactedAt: Date;

  @Prop()
  deletedAt?: Date;

  @Prop({
    required: true,
  })
  user: string;
  @Prop({
    required: true,
  })
  @Prop({ default: null })
  userhaveaccessforreadonly: Array<string>;
  @Prop({ default: null })
  userhavefullaccess: Array<string>;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
