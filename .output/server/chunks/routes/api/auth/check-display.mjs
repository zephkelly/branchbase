import { e as eventHandler, g as getQuery, p as pool } from '../user/get-id.get.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'pg';
import 'dotenv';
import 'sharp';
import 'node:fs';
import 'node:url';

const checkDisplay = eventHandler(async (event) => {
  const query = getQuery(event);
  const displayName = query.name;
  const doesExist = await doesDisplayNameExist(displayName);
  async function doesDisplayNameExist(displayName2) {
    try {
      const result = await pool.query("SELECT display_name FROM user_metadata WHERE display_name = $1", [displayName2]);
      return result.rowCount > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  return {
    statusCode: 200,
    body: {
      nameExists: doesExist
    }
  };
});

export { checkDisplay as default };
//# sourceMappingURL=check-display.mjs.map
