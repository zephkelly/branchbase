import { e as eventHandler, g as getQuery, p as pool } from './user/get-id.get.mjs';
import { v as validateQueryLength } from '../../_/validation.mjs';
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

const branches_get = eventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page || 1;
  let limit = query.limit || 6;
  const lastLimit = query.lastLimit || limit;
  const isValid = validateQueryLength(page, limit, lastLimit);
  if (!isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid query." })
    };
  }
  if (limit <= 0) {
    limit = 100;
  }
  const offset = (page - 1) * limit + (lastLimit - limit);
  const startTime = performance.now();
  const branches = await pool.query("SELECT * FROM branches ORDER BY id LIMIT $1 OFFSET $2", [limit, offset]);
  const totalBranches = await pool.query("SELECT COUNT(*) FROM branches");
  const endTime = performance.now();
  if (!branches.rows) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No branches found." })
    };
  }
  return {
    statusCode: 200,
    body: {
      branches: JSON.parse(JSON.stringify(branches)).rows,
      metadata: {
        totalBranches: parseInt(totalBranches.rows[0].count, 10),
        page,
        limit,
        queryTime: `${(endTime - startTime).toFixed(2)}ms`
      }
    }
  };
});

export { branches_get as default };
//# sourceMappingURL=branches.get.mjs.map
