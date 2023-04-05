import mongoose from "mongoose";
import { PostSchema } from "./post";

//--------------------Branch --------------------
// This is the schema for storing all data for the site's branches.
//
export enum BranchType {
  PUBLIC="public",
  SECRET="secret"
}

export interface Branches_Metadata {
  branch_name: string;
  creator_user_id: string;
  owner_user_id: string;
  branch_type: BranchType;
  description: string;
  created_date: Date;
  updated_date: Date;
}

//SQL Schema
// CREATE TABLE branches_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   branch_name VARCHAR(255) NOT NULL,
//   creator_user_id VARCHAR(255) NOT NULL,
//   owner_user_id VARCHAR(255) NOT NULL,
//   branch_type VARCHAR(255) NOT NULL,
//   description VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

// ---------------Branch Post Store----------------
// This is the schema for storing all posts for the site's branches.
//
export interface Branch_Post_Store {
  branch_id: string;
  created_date: Date;
  updated_date: Date;
  posts: [typeof PostSchema];
}

//MongoDB Schema
const BranchPostStoreSchema = new mongoose.Schema({
  branch_id: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  posts: {
    type: [PostSchema],
    required: true,
    default: [],
  },
});

//MogoDB Model
export const BranchPostStore = mongoose.model(
  "BranchPostStore",
  BranchPostStoreSchema
);