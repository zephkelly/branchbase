import { pool } from '~~/server/postgres';

export default eventHandler(async (event: any) => {
  const query = getQuery(event);
  const email: string = query.email as string;
  
  let userId: any;

  try {
    userId = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  }
  catch (err) {
    console.log(err);
  }
  
  return {
    statusCode: 200,
    body: {
      userExists: userId.rowCount > 0
    }
  };
});