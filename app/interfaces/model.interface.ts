import { Document, Types } from 'mongoose';

export interface ITodoRefers extends Document {
  _id: Types.ObjectId;
  posted_by: string;
  email: string;
  title: string;
  description: string;
}
