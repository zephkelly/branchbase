import { getServerSession } from '#auth'
import { pool } from '~~/server/postgres';
import mongoose from 'mongoose';
import { BranchModel, branch_metadata, posts_metadata } from '~~/models/branches';
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
  let _id: number | null = null;

  try {
    transaction.startTransaction();

    // Branch post, admin, moderator collections
    const newBranch = await BranchModel.create({ branch_id: name, admins: [session.user.email] });

    const saved = await newBranch.save();
    _id = intFromObjectId(saved._id);

    await transaction.commitTransaction();
  }
  catch (error) {
    await transaction.abortTransaction();

    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong creating branch collection.' }),
    };
  }

  try {
    await pool.query('BEGIN');
  
    // Branch metadata
    await pool.query(
      `INSERT INTO ${branch_metadata} (
        id,
        branch_id,
        description,
        branch_collection,
        creator_name,
        creator_email,
        owner_name,
        owner_emai
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [_id, name, description, name, session.user.name, session.user.email, session.user.name, session.user.email]
    );

    // Metadata for the posts of this branch
    await pool.query(
      `CREATE TABLE ${posts_metadata}.${pool.escapeIdentifier(name)} (
        id SERIAL PRIMARY KEY,
        user_id STRING NOT NULL,
        title TEXT NOT NULL,
        content TEXT,
        branch_id STRING NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        tags TEXT[] USING gin
      )`
    );

    await pool.query('COMMIT');
  }
  catch (err) {
    await pool.query('ROLLBACK');

    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong creating branch / branch_post metadata.' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Branch created.' }),
  };
});

async function doesBranchExist(branchName: string) {
  return await pool.query(
    `SELECT EXISTS (SELECT FROM ${branch_metadata} WHERE name = $1)`,
    [branchName]
  );
}