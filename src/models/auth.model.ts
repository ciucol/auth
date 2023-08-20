import mongoose, { Schema } from 'mongoose';
import { UserInterface } from '../interfaces/user.interface';

const authCollection: string = 'auth';

const authSchema: Schema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  fullname: String,
  role: String,
});

export const Auth = mongoose.model<UserInterface>(authCollection, authSchema);
