import { pool } from '~~/server/plugins/postgres';

export default eventHandler(async (event: any) => {
  const query = getQuery(event);
  const displayName: string = query.name as string;

  const doesExist: boolean = await doesDisplayNameExist(displayName);

  async function doesDisplayNameExist(displayName: string): Promise<boolean> {
    try {
      const result = await pool.query('SELECT display_name FROM user_metadata WHERE display_name = $1', [displayName]);
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