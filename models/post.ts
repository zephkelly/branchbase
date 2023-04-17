enum PostContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  LINK = "link",
}

enum PostStatus {
  ACTIVE = "active",
  DELETED = "deleted",
  LOCKED = "locked",
  HIDDEN = "hidden"
}

enum PostFlair {
  NSFW = "nsfw",
  POLITICAL = "political",
  SPOILER = "spoiler",
  DISCUSSION = "discussion",
  QUESTION = "question",
  ANNOUNCEMENT = "announcement",
  META = "meta",
  OTHER = "other",
}

export interface Posts {
  // id: number;
  branch_id: number;
  user_id: number;
  post_title: string;
  content_type: PostContentType;
  content: Object;
  post_status: PostStatus;
  post_flairs: [PostFlair];
  created_at: Date;
  updated_at: Date;
}

//SQL Schema
// CREATE TABLE posts (
//   id BIGSERIAL PRIMARY KEY,
//   branch_id INTEGER REFERENCES branches(id),
//   user_id INTEGER REFERENCES users(id),
//   post_title VARCHAR(255) NOT NULL,
//   content_type VARCHAR(255) NOT NULL,
//   content JSONB NOT NULL,
//   post_status VARCHAR(255) NOT NULL,
//   post_flairs VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
//   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );