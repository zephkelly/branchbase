import { pool } from '~~/server/plugins/postgres';
import { validateQueryLength } from '~~/utils/forms/validation';
import type { Branches } from '~~/models/branches';

export default eventHandler(async (event: any) => {
  const query  = getQuery(event);
  const branchName: string = query.name as string;

  //-----------------Validation-----------------
  if (!validateQueryLength(branchName)) {
    console.log("Invalid query.")
    return {
      statusCode: 400,
      body: 'Invalid query'
    };
  }

  //-----------------Query-----------------
  const result = await pool.query(`
    SELECT * FROM branches WHERE branch_name = $1`,
    [branchName]
  );

  const branchData = result.rows[0];

  if (!branchData) {
    console.log("Branch not found.")
    return {
      statusCode: 400,
      body: 'Branch not found.'
    }
  }

  const branch: Branches = branchData;

  //@ts-ignore
  const postResult = await pool.query(`SELECT * FROM posts WHERE branch_id = $1;`, [branch.id]);
  const posts = postResult.rows;
  
  return {
    statusCode: 200,
    branch: branch,
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

