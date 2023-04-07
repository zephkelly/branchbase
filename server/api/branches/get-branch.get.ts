import { pool } from '~~/server/postgres';
import { validateQuery } from '~~/utils/validateQuery';
import { Branches, Branch_Metadata, BranchPostStore } from '~~/models/branches';
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
  const result = await pool.query(`
    SELECT 
      b.*, 
      bm.*
    FROM 
      branches b 
      JOIN branch_metadata bm ON b.id = bm.branch_id
    WHERE 
      b.branch_name = $1;`,
    [branchName]);

  const rows = result.rows;
  const branchData = result.rows[0];

  const branch: Branches = {
    branch_name: branchData.branch_name,
    icon_image: branchData.icon_image,
    branch_type: branchData.branch_type,
    description: branchData.description,
    created_date: branchData.created_at,
    updated_date: branchData.updated_at
  };
  
  const branchMeta: Branch_Metadata = {
    branch_id: branchData.id,
    branch_title: branchData.branch_title,
    creator_user_id: branchData.creator_user_id,
    owner_user_id: branchData.owner_user_id,
    background_image: branchData.background_image
  };

  const postResult = await pool.query(`
    SELECT * FROM post_metadata WHERE branch_id = $1;`, [branchMeta.branch_id]);

  const posts = postResult.rows;
  
  return {
    statusCode: 200,
    branch: branch,
    branchMeta: branchMeta,
    posts: posts,
  }

  //Helper functions
  async function doesBranchExist(): Promise<boolean> {
    let result = null;
    
    try {
      result = await pool.query('SELECT branch_name FROM branches WHERE branch_name = $1', [query.branchName]);
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

