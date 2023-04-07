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
  email: string;
  password: string; //Hashed
  auth_provider: AuthProvider;
  verified: boolean;
}

// CREATE TABLE users (
//   id BIGSERIAL PRIMARY KEY,
//   email VARCHAR(255) NOT NULL,
//   password VARCHAR(255),
//   auth_provider VARCHAR(255),
//   verified BOOLEAN DEFAULT FALSE
// );

//--------------------UserMetadata--------------------
// Created dates stored here
export interface UserMetadata {
  user_id: number,
  display_name: string;
  avatar_url: string;
  bio: string;
}

export const user_metadata: string = 'user_metadata';

// CREATE TABLE user_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT REFERENCES users(id),
//   display_name VARCHAR(255),
//   avatar_url VARCHAR(255),
//   bio VARCHAR(255),
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

//--------------------UserStats--------------------
//
export interface UserStats {
  user_id: number;
  view_count: number;
  post_count: number;
  comment_count: number;
  like_count: number;
  dislike_count: number;
}

export const user_stats: string = 'user_stats';

// CREATE TABLE user_stats (
//   id BIGSERIAL PRIMARY KEY,
//   user_id BIGINT REFERENCES users(id),
//   view_count INT DEFAULT 0,
//   post_count INT DEFAULT 0,
//   comment_count INT DEFAULT 0,
//   like_count INT DEFAULT 0,
//   dislike_count INT DEFAULT 0
// );