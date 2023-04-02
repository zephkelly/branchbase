export interface Comment {
  id: string;
  content: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  parent_comment_id?: string;
  comments?: any[];
}