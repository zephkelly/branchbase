import mongoose from 'mongoose';

export enum AuthProvider {
  email = 'email',
  discord = 'discord',
  github = 'github',
  google = 'google',
} 

//--------------------User--------------------
//
export interface Users {
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
  //Id of userprofile
  email: string;
  display_name: string;
  bio: string;
  avatar_url: string;
}

export const user_metadata: string = 'user_metadata';

// CREATE TABLE user_metadata (
//   id SERIAL PRIMARY KEY,
//   email VARCHAR(255) NOT NULL,
//   display_name VARCHAR(255),
//   bio TEXT,
//   avatar_url VARCHAR(255),
//   subscribed_branches TEXT[],
//   friends TEXT[]
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
//   id SERIAL PRIMARY KEY,
//   display_name VARCHAR(255),
//   views INT,
//   posts INT,
//   comments INT,
//   likes INT,
//   dislikes INT
// );