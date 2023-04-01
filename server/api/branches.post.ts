import { getServerSession } from '#auth'
import { pool } from '~~/server/postgres';
import { BranchModel } from '~~/models/branches';
import { validateQuery } from '~~/utils/validateQuery';

export default eventHandler(async (event) => {
  const session: any = await getServerSession(event);
  const body = await readBody(event);
  const { name, description } = body;

  const isValid = validateQuery(name, description);

  if (!isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid query.' }),
    };
  }

  const doesExist = await doesBranchExist(name);
  if (doesExist.rows[0].exists) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Branch already exists.' }),
    };
  }

  await pool.query(
    'INSERT INTO branches (branch_id, description, branch_collection, creator_name, creator_email, owner_name, owner_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [name, description, name, session.user.name, session.user.email, session.user.name, session.user.email]
  );

  const admins: string[] = [session.user.email];

  const newBranch = await BranchModel.create({ branch_id: name, admins: admins });

  await newBranch.save();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Branch created.' }),
  };
});

async function doesBranchExist(branchName: string) {
  return await pool.query(
    'SELECT EXISTS (SELECT FROM branches WHERE name = $1)',
    [branchName]
  );
}