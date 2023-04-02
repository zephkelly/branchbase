import mongoose from 'mongoose';

export enum AuthProvider {
  email = 'email',
  discord = 'discord',
  github = 'github',
  google = 'google',
} 

//--------------------User--------------------
//
export interface User {
  display_name: string;
  email: string;
  verified: boolean;
  password: string; //Hashed
  auth_provider: AuthProvider;
  createdDate: Date;
  updatedDate: Date;
  comments: string[];
  posts: string[];
  subscribed_branches: number[];
  friends: string[];
}

export const UserSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  display_name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  password: {
    type: String,
    required: false
  },
  auth_provider: {
    type: String,
    enum: Object.values(AuthProvider),
    required: true
  },
  comments: {
    type: Array,
    required: false,
    default: []
  },
  posts: {
    type: Array,
    required: false,
    default: []
  },
  subscribed_branches: {
    type: Array,
    required: false,
    default: []
  },
  friends: {
    type: Array,
    required: false,
    default: []
  }
}, { timestamps: true });

export const UserModel = mongoose.model('users', UserSchema);

//--------------------UserMetadata--------------------
//
export interface UserMetadata {
  email: string;
  display_name: string;
  password: string; //Hashed
  auth_provider: AuthProvider;
  verified: boolean;
  avatar_url: string;
  bio: string;
}

export const user_metadata: string = 'user_metadata';

// CREATE TABLE user_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   email VARCHAR(255) NOT NULL,
//   display_name VARCHAR(255),
//   password VARCHAR(255),
//   auth_provider VARCHAR(255),
//   verified BOOLEAN,
//   avatar_url VARCHAR(255),
//   bio TEXT
// );

//--------------------UserStats--------------------
//
export interface UserStats {
  //id of userprofile
  display_name: string;
  views: number;
  posts: number;
  comments: number;
  likes: number;
  dislikes: number;
}

export const user_stats: string = 'user_stats';

// CREATE TABLE user_stats (
//   id BIGSERIAL PRIMARY KEY,
//   view_count INT,
//   post_count INT,
//   comment_count INT,
//   like_count INT,
//   dislike_count INT
// );