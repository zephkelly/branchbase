import mongoose from "mongoose";

//--------------------Post--------------------
// This is the post schema for storing post content,
// and comments for a post.
//
export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: number;
  branch_id: number;
  created_at: Date;
  updated_at: Date;
  comments: Object[];
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
    type: Object
  }]
}, { timestamps: true });


//--------------------Post Metadata--------------------
// This is the schema for storing all metadata for the site's posts.
// Will be stored under a table named after the branch_id.
// eg. posts_metadata.branch_id
//
export interface Post_Metadata {
  id: string; // This the the _id of the post
  title: string;
  content: string;
  user_id: number; // This is the _id of the user who created the post
  branch_id: number;
  created_at: Date;
  updated_at: Date;
  tags: string[];
}