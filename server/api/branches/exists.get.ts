import { pool } from '~~/server/plugins/postgres';
import { validateQueryLength } from '~~/utils/forms/validation';

export default eventHandler(async (event: any) => {
  const query = getQuery(event);
  
  if (!validateQueryLength(query.branchName as string)) {
    return {
      statusCode: 400,
      body: 'Invalid query. Missing or too long/short.'
    };
  }

  if (await doesBranchExist()) {
    return {
      statusCode: 200,
      exists: true,
    };
  }
  else {
    return {
      statusCode: 200,
      exists: false
    };
  }

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