//------------------Dislikes------------------
// This is the post schema for storing likes
//
//
export interface Dislike {
  id: string;
  post_id: string;
  comment_id: string;
  branch_id: string;
  user_id: string;
}