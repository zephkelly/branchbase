import mongoose from 'mongoose';
import { PostSchema, Post } from './post';

//--------------------Branch--------------------
//
export interface Branch {
  branch_id: string;
  admins: string[];
  moderators: string[];
  tags: string[];
  posts: Post[];
  createdDate: Date;
  updatedDate: Date;
}

export const BranchSchema = new mongoose.Schema({
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
  tags: {
    type: Array,
    required: false,
    default: [],
  },
  posts: [PostSchema],
}, { timestamps: true });

export const BranchModel = mongoose.model('branches', BranchSchema);

//sql schema
export interface Branch_Meta {
  id: number;
  branch_id: string;
  creator_name: string;
  creator_email: string;
  owner_name: string;
  owner_email: string;
  description: string;
  created_at: Date;
  branch_collection: string;
}

export const branch_metadata: string = 'branch_metadata';
export const posts_metadata: string = 'posts_metadata';

//SQL Schema
// CREATE TABLE branch_metadata (
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

// CREATE SCHEMA IF NOT EXISTS posts_metadata;
