import mongoose from "mongoose";
import type { Comment } from "./comment";

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: number;
  branch_id: number;
  created_at: Date;
  updated_at: Date;
  comments: Comment[];
}

export const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: String,
  user_id: {
    type: String,
    required: true,
  },
  branch_id: {
    type: String,
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }]
}, { timestamps: true });


//SQL Schema --------------------------------------
export interface Post_Metadata {
  id: string;
  title: string;
  content: string;
  user_id: number;
  branch_id: number;
  created_at: Date;
  updated_at: Date;
  tags: string[];
}

// post_metadata must be linked via branch_id to branches

// CREATE TABLE post_metadata (
//   id SERIAL PRIMARY KEY,
//   title TEXT NOT NULL,
//   content TEXT,
//   user_id STRING NOT NULL,
//   branch_id STRING NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   updated_at TIMESTAMP NOT NULL,
//   tags TEXT[] USING gin
// );