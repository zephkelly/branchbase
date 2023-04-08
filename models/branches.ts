import mongoose from "mongoose";
import { PostSchema } from "./post";

//--------------------Branch --------------------
// This is the schema for storing all data for the site's branches.
//
export enum BranchType {
  PUBLIC="public",
  SECRET="secret"
}

export interface Branches {
  //id: string;
  branch_name: string;
  icon_image: string;
  branch_type: BranchType;
  description: string;
  created_date: Date;
  updated_date: Date;
}

//SQL table
// CREATE TABLE branches (
//   id BIGSERIAL PRIMARY KEY,
//   branch_name VARCHAR(255) NOT NULL,
//   icon_image VARCHAR(255) NOT NULL,
//   branch_type VARCHAR(255) NOT NULL,
//   description VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

//--------------------Branch Metadata--------------------
//
export interface Branch_Metadata {
  //id: string;
  branch_id: string;
  branch_title: string;
  creator_user_id: string;
  owner_user_id: string;
  background_image: string;
}

//SQL Schema
// CREATE TABLE branch_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   branch_id BIGINT REFERENCES branches(id),
//   branch_title VARCHAR(255) NOT NULL,
//   creator_user_id VARCHAR(255) NOT NULL,
//   owner_user_id VARCHAR(255) NOT NULL,
//   background_image VARCHAR(255) NOT NULL
// );

// ---------------Branch Pages-----------------------------
// This is the schema for storing all pages for a branches pages
enum PageType {
  ABOUT = "about",
  CONTACT = "contact",
  FAQ = "faq",
  RULES = "rules",
  LINK = "link",
  OTHER = "other",
}

enum PageContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  LINK = "link",
  QUOTE = "quote",
  POLL = "poll",
}

export interface Branch_Page_Content {
  //id: string;
  url: string;
  type: PageContentType;
  content: string;
}

export interface Branch_Pages {
  //id: string;
  branch_id: string;
  page_title: string;
  page_heading: string;
  page_subheading: string;
  page_type: PageType;
  created_date: Date;
  updated_date: Date;
  page_content: [Branch_Page_Content];
}

const Branch_Page_Content = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Branch_Pages = new mongoose.Schema({
  branch_id: {
    type: String,
    required: true,
  },
  page_title: {
    type: String,
    required: true,
  },
  page_heading: {
    type: String,
    required: true,
  },
  page_subheading: {
    type: String,
    required: false,
  },
  page_type: {
    type: String,
    required: true,
  },
  page_content: {
    type: [Branch_Page_Content],
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


// ---------------Branch Page Metadata---------------------
// This is the schema for storing all metadata for a branches pages
export interface Branch_Page_Metadata {
  //id: string;
  branch_id: string;
  page_id: string; //From mongodb objectid
  page_url: string;
  page_title: string;
  page_type: PageType;
}

//SQL table
// CREATE TABLE branch_page_metadata (
//   id BIGSERIAL PRIMARY KEY,
//   branch_id BIGINT REFERENCES branches(id),
//   page_id TEXT NOT NULL,
//   page_url VARCHAR(255) NOT NULL,
//   page_title VARCHAR(255) NOT NULL,
//   page_type VARCHAR(255) NOT NULL
// );

// ---------------Branch Collections-----------------------
// This is the schema for storing all posts for the site's branches.
// branch-pages are stored in this schema.
export interface Branch_Collections_Interface {
  branch_id: string;
  created_date: Date;
  updated_date: Date;
  branch_pages: [typeof Branch_Pages];
  posts: [typeof PostSchema];
}

//MongoDB Schema
const Branch_Collections = new mongoose.Schema({
  branch_id: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  branch_pages: {
    type: [Branch_Pages],
    required: true,
    default: [],
  },
  posts: {
    type: [PostSchema],
    required: true,
    default: [],
  },
});

//MogoDB Model
export const BranchCollections = mongoose.model(
  "branch_collections",
  Branch_Collections
);