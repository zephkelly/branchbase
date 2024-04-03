import { e as eventHandler, g as getQuery, p as pool } from '../user/get-id.get.mjs';
import { v as validateQueryLength } from '../../../_/validation.mjs';
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

const exists_get = eventHandler(async (event) => {
  const query = getQuery(event);
  if (!validateQueryLength(query.branchName)) {
    return {
      statusCode: 400,
      body: "Invalid query. Missing or too long/short."
    };
  }
  if (await doesBranchExist()) {
    return {
      statusCode: 200,
      exists: true
    };
  } else {
    return {
      statusCode: 200,
      exists: false
    };
  }
  async function doesBranchExist() {
    let result = null;
    try {
      result = await pool.query("SELECT branch_name FROM branches WHERE branch_name = $1", [query.branchName]);
    } catch (err) {
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

export { exists_get as default };
//# sourceMappingURL=exists.get.mjs.map
