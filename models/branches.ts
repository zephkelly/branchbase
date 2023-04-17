//--------------------Branch --------------------
// This is the schema for storing all data for the site's branches.
//
export enum BranchType {
  PUBLIC="public",
  SECRET="secret"
}

// ---------------Branch Pages-----------------------------
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
  LINK = "link",
}

export interface Branch_Page_Content {
  type: PageContentType;
  content: [{ 
    text: [string];
    link: string;
  }];
}

export interface BranchPage {
  //id: string;
  branch_id: string;
  page_title: string;
  page_heading: string;
  page_subheading: string;
  page_type: PageType;
  updated_at: Date;
  page_content: [Branch_Page_Content];
}
  
//--------------------Branches--------------------
//
export interface Branches {
  // id: string;
  branch_name: string;
  branch_title: string;
  description: string;
  branch_type: BranchType;
  // pages: [BranchPage];
  creator_user_id: string;
  owner_user_id: string;
  background_image: string;
  icon_image: string;
  tags: [string];
  created_at: Date;
  updated_at: Date;
}

//SQL Schema
// CREATE TABLE branches (
//   id BIGSERIAL PRIMARY KEY,
//   branch_name VARCHAR(255) NOT NULL,
//   branch_title VARCHAR(255) NOT NULL,
//   branch_type VARCHAR(255) NOT NULL,
//   description VARCHAR(255) NOT NULL,
//   pages JSONB,
//   creator_user_id VARCHAR(255) NOT NULL,
//   owner_user_id VARCHAR(255) NOT NULL,
//   background_image VARCHAR(255) NOT NULL,
//   icon_image VARCHAR(255) NOT NULL,
//   tags VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );