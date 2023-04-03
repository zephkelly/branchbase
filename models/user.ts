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
  id: number;
  email: string;
  password: string; //Hashed
  auth_provider: AuthProvider;
}

export const UserSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  auth_provider: {
    type: String,
    enum: Object.values(AuthProvider),
    required: true
  }
});

export const UserModel = mongoose.model('users', UserSchema);

//--------------------UserMetadata--------------------
//
export interface UserMetadata {
  email: string;
  display_name: string;
  auth_provider: AuthProvider;
  verified: boolean;
  avatar_url: string;
  bio: string;
  createdDate: Date;
  updatedDate: Date;
}

export const user_metadata: string = 'user_metadata';

// CREATE TABLE user_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   email VARCHAR(255) NOT NULL,
//   display_name VARCHAR(255),
//   auth_provider VARCHAR(255),
//   verified BOOLEAN,
//   avatar_url VARCHAR(255),
//   bio TEXT
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

//--------------------UserStats--------------------
//
export interface UserStats {
  //id of userprofile
  view_count: number;
  post_count: number;
  comment_count: number;
  like_count: number;
  dislike_count: number;
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