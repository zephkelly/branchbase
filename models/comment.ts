// ------------Comment Model----------------
export interface Comment {
  id: string;
  user_id: number;
  post_id: string;
  content: string;
  parent_comment_id?: string;
  content_type: string;
}

// CREATE TABLE comments (
//   id SERIAL PRIMARY KEY,
//   user_id INTEGER REFERENCES users(id),
//   post_id INTEGER REFERENCES posts(id),
//   parent_id INTEGER REFERENCES comments(id),
//   content TEXT,
// );

//--------------------Comment Metadata--------------------
export interface CommentMetadata {
  id: string;
  comment_id: string;
  tag: string;
  keyword: string;
  created_at: Date;
  updated_at: Date;
}

// CREATE TABLE comment_metadata (
//   id SERIAL PRIMARY KEY,
//   comment_id INTEGER REFERENCES comments(id),
//   tag VARCHAR(255),
//   keyword VARCHAR(255)
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );