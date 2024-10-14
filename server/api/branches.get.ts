import { pool } from '~~/server/plugins/postgres';
import { validateQueryLength } from '~~/utils/forms/validation';

export default eventHandler(async (event: any) => {
    try {
        const query = getQuery(event);
        const page: number = query.page as number || 1;
        let limit: number = query.limit as number || 6;
        const lastLimit: number = query.lastLimit as number || limit;

        const isValid = validateQueryLength(page, limit, lastLimit);
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

        let branches, totalBranches;

        try {
            branches = await pool.query('SELECT * FROM branches ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
            totalBranches = await pool.query('SELECT COUNT(*) FROM branches');
        } catch (dbError) {
            console.error('Database error:', dbError);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'An error occurred while fetching data from the database.' }),
            };
        }

        const endTime: number = performance.now();

        if (!branches.rows || branches.rows.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No branches found.' }),
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
                    queryTime: `${(endTime - startTime).toFixed(2)}ms`,
                }
            }
        };
    } catch (error) {
        console.error('Unexpected error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An unexpected error occurred.' }),
        };
    }
});