import { mongoose } from "@/plugins/mongo";

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

export const Post = mongoose.model('Post', {
  id: String,
  title: String,
  content: String,
  user_id: Number,
  branch_id: Number,
  created_at: Date,
  updated_at: Date,
  comments: String
});