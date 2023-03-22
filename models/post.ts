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

//Mongo for creating the tables:
// {
//   "_id": ObjectId,
//   "title": String,
//   "content": String,
//   "user_id": Number,
//   "subreddit_id": Number,
//   "created_at": Date,
//   "updated_at": Date,
//   "comments": [
//     // Array of Comment objects, recursively nested
//   ]
// }