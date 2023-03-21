export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: number;
  branch_id: number;
  created_at: Date;
  updated_at: Date;
  comments: Comment[];
}

//Mongo for creating the tables:
// {
//   "_id": ObjectId,
//   "title": String,
//   "content": String,
//   "user_id": Number,
//   "branch_id": Number,
//   "created_at": Date,
//   "updated_at": Date,
//   "comments": [
//     // Array of Comment objects, recursively nested
//   ]
// }