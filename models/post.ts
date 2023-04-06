import mongoose from "mongoose";

//--------------------Post--------------------
// This is the post schema for storing post content,
// likes, dislikes, and comments for a post.
//
enum PostContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  LINK = "link",
}

enum PostStatus {
  ACTIVE = "active",
  DELETED = "deleted",
  LOCKED = "locked",
  HIDDEN = "hidden"
}

export interface Post {
  content: Object;
  post_id: string;
  branch_id: string;
  user_id: string;
  likes: [
    {
      user_id: string;
      like_id: string;
    }
  ];
  dislikes: [
    {
      user_id: string;
      like_id: string;
    }
  ];
  comments: [
    {
      user_id: string;
      comment_id: string;
      content: string;
      created_at: Date;
      updated_at: Date;
    }
  ];
}

export const PostSchema = new mongoose.Schema({
  post_id: {  //From metadata
    type: String,
    required: true,
  },
  branch_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  content: Object,
  likes: [
    {
      like_id: {
        type: String,
        required: true,
      },
      user_id: {
        type: String,
        required: true,
      },
    },
  ],
  dislikes: [
    {
      dislike_id: {
        type: String,
        required: true,
      },
      user_id: {
        type: String,
        required: true,
      },
    },
  ],
  comments: [
    {
      user_id: {
        type: String,
        required: true,
      },
      comment_id: {
        type: String,
        required: true,
      },
      parent_comment_id: {
        type: String,
        required: false,
      },
      content: {
        type: String,
        required: true,
      },
      created_at: {
        type: Date,
        required: true,
      },
      updated_at: {
        type: Date,
        required: true,
      },
    },
  ],
});

//--------------------Post Metadata--------------------
// This is the schema for storing all metadata for the site's posts.
// 
export interface Post_Metadata {
  id: number;
  title: string;
  content: string;
  content_type: PostContentType;
  post_status: PostStatus;
  user_id: number; // This is the _id of the user who created the post
  branch_id: number;
  created_at: Date;
  updated_at: Date;
}

//SQL Schema
// CREATE TABLE post_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   content VARCHAR(255) NOT NULL,
//   content_type VARCHAR(255) NOT NULL,
//   post_status VARCHAR(255) NOT NULL,
//   user_id INTEGER REFERENCES users(id),
//   branch_id INTEGER REFERENCES branches_metadata(id),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );