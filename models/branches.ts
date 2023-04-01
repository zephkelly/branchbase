import mongoose from 'mongoose';
import { PostSchema } from './post';

export interface Branch_Meta {
  id: string;
  branch_id: string;
  creator_name: string;
  creator_email: string;
  owner_name: string;
  owner_email: string;
  description: string;
  created_at: Date;
  branch_collection: string;
}

export const BranchColletionSchema = new mongoose.Schema({
  branch_id: {
    type: String,
    required: true,
  },
  admins: {
    type: Array,
    required: true,
  },
  moderators: {
    type: Array,
    required: false,
    default: [],
  },
  posts: [PostSchema],
}, { timestamps: true });

export const BranchModel = mongoose.model('Branch', BranchColletionSchema);

//SQL Schema
// CREATE TABLE branches (
//   id SERIAL PRIMARY KEY,
//   branch_id VARCHAR(255) NOT NULL,
//   creator_name VARCHAR(255) NOT NULL,
//   creator_email VARCHAR(255) NOT NULL,
//   owner_name VARCHAR(255) NOT NULL,
//   owner_email VARCHAR(255) NOT NULL,
//   description VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   branch_collection VARCHAR(255) NOT NULL
// );