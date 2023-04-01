import { getServerSession } from '#auth'
import { pool } from '~~/server/postgres';
import mongoose from 'mongoose';
import { BranchModel } from '~~/models/branches';
import { Post_Metadata } from '~~/models/post';
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

  const transaction = await mongoose.startSession();
  
  try {
    transaction.startTransaction();

    const newBranch = await BranchModel.create({ branch_id: name, admins: [session.user.email] });
    await newBranch.save();

    await transaction.commitTransaction();
  } catch (error) {
    await transaction.abortTransaction();
    console.error(error);
  }

  try {
    await pool.query('BEGIN');

    await pool.query(
      'INSERT INTO branches (branch_id, description, branch_collection, creator_name, creator_email, owner_name, owner_email) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, name, session.user.name, session.user.email, session.user.name, session.user.email]
    );

    await pool.query(
      ` CREATE TABLE post_metadata_${pool.escapeIdentifier(name)} (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT,
          user_id STRING NOT NULL,
          branch_id STRING NOT NULL,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL,
          tags TEXT[] USING gin
        )
      `
    );

    await pool.query('COMMIT');
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }

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