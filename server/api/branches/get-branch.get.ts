import { pool } from '~~/server/postgres';
import { validateQuery } from '~~/utils/validateQuery';
import { Branches_Metadata, BranchPostStore } from '~~/models/branches';
import { Post } from '~~/models/post';

export default eventHandler(async (event: any) => {
  const query  = getQuery(event);
  const branchName: string = query.name as string;

  //-----------------Validation-----------------
  if (await !doesBranchExist()) {
    console.log("Branch doesn't exist.")
    return {
      statusCode: 200,
      exists: false,
    };
  }

  if (!validateQuery(branchName)) {
    console.log("Invalid query.")
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid query.' }),
    };
  }

  //-----------------Query-----------------
  const branchMeta = await pool.query('SELECT * FROM branches_metadata WHERE branch_name = $1', [branchName]);
  const branch: Branches_Metadata = branchMeta.rows[0];

  // //This grabs all the posts under this branch, full info
  // const postStore = await BranchPostStore.find({ branch_id: branch.id }).exec();
  // const posts = postStore[0].posts;

  //This grabs all the post metadata under this branch
  const postStore = await pool.query('SELECT * FROM post_metadata WHERE branch_id = $1', [branch.id]);
  const posts: Post[] = postStore.rows;

  return {
    statusCode: 200,
    branch: branch,
    posts: posts,
  }

  //Helper functions
  async function doesBranchExist(): Promise<boolean> {
    let result = null;
    
    try {
      result = await pool.query('SELECT branch_name FROM branches_metadata WHERE branch_name = $1', [query.branchName]);
    } catch(err) {
      console.log(err);
      return false;
    }
  
    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  }
});

