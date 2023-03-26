import mongoose from 'mongoose';

export enum AuthProvider {
  email = 'email',
  github = 'github',
  google = 'google',
} 

export interface User {
  email: string;
  password: string; //Hashed
  auth_provider: AuthProvider;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  email: number;
  display_name: string;
  bio: string;
  avatar_url: string;
  subscribed_branches: string[];
  friends: string[];
}

export const UserSchema = new mongoose.Schema({
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
  },
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    required: true
  }
});

export const UserModel = mongoose.model('User', UserSchema);

// CREATE TABLE user_profiles (
//   user_id SERIAL PRIMARY KEY,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   display_name VARCHAR(255),
//   bio TEXT,
//   avatar_url VARCHAR(255),
//   subscribed_branches TEXT[],
//   friends TEXT[]
// );