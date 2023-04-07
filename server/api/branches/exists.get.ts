import { pool } from '~~/server/postgres';
import { validateQuery } from '~~/utils/validateQuery';

export default eventHandler(async (event: any) => {
  const query  = getQuery(event);

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