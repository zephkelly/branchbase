import { e as eventHandler, g as getQuery, p as pool } from '../../user/get-id.get.mjs';
import { v as validateQueryLength } from '../../../../_/validation.mjs';
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

const branch_get = eventHandler(async (event) => {
  const query = getQuery(event);
  const branchName = query.name;
  if (!validateQueryLength(branchName)) {
    console.log("Invalid query.");
    return {
      statusCode: 400,
      body: "Invalid query"
    };
  }
  const result = await pool.query(
    `
    SELECT * FROM branches WHERE branch_name = $1`,
    [branchName]
  );
  const branchData = result.rows[0];
  if (!branchData) {
    console.log("Branch not found.");
    return {
      statusCode: 400,
      body: "Branch not found."
    };
  }
  const branch = branchData;
  const postResult = await pool.query(`SELECT * FROM posts WHERE branch_id = $1;`, [branch.id]);
  const posts = postResult.rows;
  return {
    statusCode: 200,
    branch,
    posts
  };
});

export { branch_get as default };
//# sourceMappingURL=branch.get.mjs.map
