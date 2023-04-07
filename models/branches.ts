import mongoose from "mongoose";
import { PostSchema } from "./post";

//--------------------Branch --------------------
// This is the schema for storing all data for the site's branches.
//
export enum BranchType {
  PUBLIC="public",
  SECRET="secret"
}

export interface Branches {
  //id: string;
  branch_name: string;
  icon_image: string;
  branch_type: BranchType;
  description: string;
  created_date: Date;
  updated_date: Date;
}

//SQL table
// CREATE TABLE branches (
//   id BIGSERIAL PRIMARY KEY,
//   branch_name VARCHAR(255) NOT NULL,
//   icon_image VARCHAR(255) NOT NULL,
//   branch_type VARCHAR(255) NOT NULL,
//   description VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

//--------------------Branch Metadata--------------------
//
export interface Branch_Metadata {
  //id: string;
  branch_id: string;
  branch_title: string;
  creator_user_id: string;
  owner_user_id: string;
  background_image: string;
}

//SQL Schema
// CREATE TABLE branch_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   branch_id BIGINT REFERENCES branches(id),
//   branch_title VARCHAR(255) NOT NULL,
//   creator_user_id VARCHAR(255) NOT NULL,
//   owner_user_id VARCHAR(255) NOT NULL,
//   background_image VARCHAR(255) NOT NULL
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
  moderators: {
    type: [String],
    required: true,
    default: [],
  },
  admins: {
    type: [String],
    required: true,
    default: [],
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