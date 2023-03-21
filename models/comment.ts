interface Comment {
  id: string;
  content: string;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  parent_comment_id?: string;
  comments?: Comment[];
}

//Mongo for creating the tables:
// {
//   "_id": ObjectId,
//   "title": String,
//   "content": String,
//   "user_id": Number,
//   "subreddit_id": Number,
//   "created_at": Date,
//   "updated_at": Date,
//   "comments": [
//     // Array of Comment objects, recursively nested
//   ]
// }