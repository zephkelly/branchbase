import { pool } from '~~/server/postgres';
import { validateQuery } from '~~/utils/validateQuery';

export default eventHandler(async (event: any) => {
//   return {
//       statusCode: 400,
//       body: JSON.stringify({ message: 'To be implemented' })
//     };
// });

  const query  = getQuery(event);

  const page: number = query.page as number || 1;
  let limit: number = query.limit as number || 6;
  const lastLimit: number = query.lastLimit as number || limit;

  const isValid = validateQuery(page, limit, lastLimit);

  if (!isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid query.' }),
    };
  }

  if (limit <= 0) {
    limit = 100;
  }
  
  const offset = (page - 1) * limit + (lastLimit - limit);

  const startTime: number = performance.now();

  const branches = await pool.query('SELECT * FROM branches ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
  const totalBranches = await pool.query('SELECT COUNT(*) FROM branches');

  const endTime: number = performance.now();

  if (!branches.rows) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No branches found.' }),
    }
  }

  return {
    statusCode: 200,
    body: {
      branches: JSON.parse(JSON.stringify(branches)).rows,
      metadata: {
        totalBranches: parseInt(totalBranches.rows[0].count, 10),
        page,
        limit,
        queryTime: `${(endTime - startTime).toFixed(2)}ms`,
      }
    }
  };
});
