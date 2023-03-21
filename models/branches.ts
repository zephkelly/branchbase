import { Post } from './post';

export interface Branch_meta {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  posts_collection: string;
}

export interface Branch extends Omit<Branch_meta, 'description' | 'posts_collection'> {
  posts: Post[];
}

// CREATE TABLE branches (
//   id TEXT PRIMARY KEY,
//   name TEXT NOT NULL,
//   description TEXT NOT NULL,
//   created_at TIMESTAMP NOT NULL DEFAULT NOW(),
//   posts_collection TEXT NOT NULL
// );