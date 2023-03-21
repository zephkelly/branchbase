import { Nitro } from 'nitropack';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

export default async (_nitroApp: Nitro) => {
  try {
    //@ts-ignore
    await mongoose.connect(process.env.MONGO_CONNECTION);
    console.log("DB connection established.");
  } catch (err) {
    console.error("DB connection failed.", err);
  }
}