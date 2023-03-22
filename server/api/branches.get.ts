import { pool } from '~~/server/postgres';

export default eventHandler(async (event) => {
  //query postgres database and return all rows in branches table
  const branches = await pool.query('SELECT * FROM branches');

  if (!branches.rows) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No branches found.' }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.parse(JSON.stringify(branches)).rows,
  };
});