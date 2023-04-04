import mongoose from 'mongoose';
import { PostSchema, Post } from './post';

//--------------------Branch --------------------
// This is the schema for storing all data for the site's branches.
//
export interface Branches {
  branch_name: string;
  creator_id: string;
  owner_id: string;
  description: string;
  created_date: Date;
  updated_date: Date;
}

export const branches: string = 'branches';

//SQL Schema
// CREATE TABLE branches (
//   id BIGSERIAL PRIMARY KEY,
//   branch_name VARCHAR(255) NOT NULL,
//   creator_user_id VARCHAR(255) NOT NULL,
//   owner_user_id VARCHAR(255) NOT NULL,
//   description VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   updated_at TIMESTAMP NOT NULL
// );


//--------------------Branch--------------------
// This is the branch schema for storing all posts for a branch.
//
export interface BranchPostStore {
  posts: Post[];
}

export const BranchStoreSchema = new mongoose.Schema({
  branch_id: String,
  posts: [PostSchema],
});

export const BranchPostStore = mongoose.model('branches_post_store', BranchStoreSchema);