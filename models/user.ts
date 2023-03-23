import mongoose from 'mongoose';

export enum AuthProvider {
  github = 'github'
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
  handle: string;
  bio: string;
  avatar_url: string;
}

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
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
//   user_id INTEGER PRIMARY KEY REFERENCES users (id),
//   display_name VARCHAR(255),
//   bio TEXT,
//   avatar_url VARCHAR(255)
// );