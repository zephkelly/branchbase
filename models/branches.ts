import mongoose from 'mongoose';
import { PostSchema, Post } from './post';

//--------------------Branch--------------------
// This is the branch schema for storing all posts,
// admins, moderators, and tags for a branch.
//
export interface Branch {
  _id: string;
  branch_name: string;
  admins: string[];
  moderators: string[];
  tags: string[];
  posts: Post[];
  createdDate: Date;
  updatedDate: Date;
}

export const BranchSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  branch_name: {
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


//--------------------Branch Metadata--------------------
// This is the schema for storing all metadata for the site's branches.
//
export interface Branch_Metadata {
  _id: number;
  branch_id: string;
  creator_id: string;
  owner_id: string;
  description: string;
  created_date: Date;
  updated_date: Date;
}

export const branch_metadata: string = 'branch_metadata';

//SQL Schema
// CREATE TABLE branch_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   branch_id VARCHAR(255) NOT NULL,
//   creator_id VARCHAR(255) NOT NULL,
//   owner_id VARCHAR(255) NOT NULL,
//   description VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   updated_at TIMESTAMP NOT NULL
// );


//-----------------Branch Post Metadata--------------------
// This is the schema for storing all post metadata for a branch.
//
export const posts_metadata: string = 'posts_metadata';

// CREATE SCHEMA IF NOT EXISTS posts_metadata;