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

const checkUser_get = eventHandler(async (event) => {
  const query = getQuery(event);
  const email = query.email;
  let userId;
  try {
    userId = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  } catch (err) {
    console.log(err);
  }
  return {
    statusCode: 200,
    body: {
      userExists: userId.rowCount > 0
    }
  };
});

export { checkUser_get as default };
//# sourceMappingURL=check-user.get.mjs.map
