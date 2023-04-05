//--------------------Likes--------------------
// This is the post schema for storing likes
//
//
export interface Like {
  id: string;
  post_id: string;
  branch_id: string;
  user_id: string;
}