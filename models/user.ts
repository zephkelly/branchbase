import mongoose from 'mongoose';

export enum AuthProvider {
  email = 'email',
  discord = 'discord',
  github = 'github',
  google = 'google',
} 

export interface User {
  display_name: string;
  email: string;
  verified: boolean;
  password: string; //Hashed
  auth_provider: AuthProvider;
  created_at: Date;
  updated_at: Date;
  comments: string[];
  posts: string[];
}

export interface UserMetadata {
  display_name: string;
  bio: string;
  avatar_url: string;
  subscribed_branches: string[];
  friends: string[];
}

//Userstats is for the users stats
export interface UserStats {
  display_name: string;
  views: number;
  posts: number;
  comments: number;
  likes: number;
  dislikes: number;
}

export const UserSchema = new mongoose.Schema({
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
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
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
  }
});

export const UserModel = mongoose.model('User', UserSchema);

// CREATE TABLE user_metadata (
//   id SERIAL PRIMARY KEY,
//   display_name VARCHAR(255),
//   bio TEXT,
//   avatar_url VARCHAR(255),
//   subscribed_branches TEXT[],
//   friends TEXT[]
// );

// CREATE TABLE user_stats (
//   id SERIAL PRIMARY KEY,
//   display_name VARCHAR(255),
//   views INT,
//   posts INT,
//   comments INT,
//   likes INT,
//   dislikes INT
// );