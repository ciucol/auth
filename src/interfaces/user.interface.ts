import { ObjectId, Document } from 'mongoose';

export interface UserInterface extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  fullname: string;
  role: string;
  __v: number;
}
