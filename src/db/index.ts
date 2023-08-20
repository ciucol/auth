import mongoose from 'mongoose';
import config from '../config';

const { db } = config;
export const mongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${db.user}:${db.password}@${db.host}/${db.name}?retryWrites=true&w=majority`,
    );
    console.log('db is connected');
  } catch (error) {
    console.log(error);
  }
};
