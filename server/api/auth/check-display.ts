import { pool } from '~~/server/postgres';
import { UserModel } from '~~/models/user';

export default eventHandler(async (event: any) => {
  const query = getQuery(event);
  const displayName: string = query.name as string;

  const doesExist: boolean = await doesDisplayNameExist(displayName);

  async function doesDisplayNameExist(displayName: string): Promise<boolean> {
    try {
      const result = await pool.query('SELECT * FROM user_profiles WHERE display_name = $1', [displayName]);
      return result.rowCount > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  return {
    statusCode: 200,
    body: {
      nameExists: doesExist,
    },
  };
});