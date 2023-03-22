import mongoose from 'mongoose';
import { PostSchema } from './post';

export interface Branch_Meta {
  id: string;
  branch_id: string;
  description: string;
  created_at: Date;
  posts_collection: string;
}

export const BranchColletionSchema = new mongoose.Schema({
  branch_id: {
    type: String,
    required: true,
  },
  posts: [PostSchema],
}, { timestamps: true });

export const BranchModel = mongoose.model('Branch', BranchColletionSchema);

//SQL Schema
// CREATE TABLE branches (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) UNIQUE NOT NULL,
//   description TEXT,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//   posts_collection VARCHAR(255) NOT NULL
// );