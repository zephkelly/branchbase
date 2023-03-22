export enum AuthProvider {
  standard = 'standard',
  facebook = 'facebook',
  google = 'google',
  github = 'github',
  twitter = 'twitter'
} 

export interface User {
  id: number;
  username: string;
  bio: string;
  email: string;
  password: string; //Hashed
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  user_id: number;
  display_name: string;
  bio: string;
  avatar_url: string;
}

//SQL for creating the tables:
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   username VARCHAR(255) UNIQUE NOT NULL,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   updated_at TIMESTAMP NOT NULL
// );

// CREATE TABLE user_profiles (
//   user_id INTEGER PRIMARY KEY REFERENCES users (id),
//   display_name VARCHAR(255),
//   bio TEXT,
//   avatar_url VARCHAR(255)
// );