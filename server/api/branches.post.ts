import { getServerSession } from '#auth'
import { pool } from '~~/server/postgres';
import mongoose from 'mongoose';
import { BranchModel, branch_metadata, posts_metadata } from '~~/models/branches';
import { User, UserModel } from '~~/models/user';
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
  
  let user: User | null = null;
  let branch_id: number | null = null;

  try {
    transaction.startTransaction();

    //Find user
    user = await UserModel.findOne({ email: session.user.email }) as User;

    // Create branch
    const newBranch = await BranchModel.create({
      branch_name: name,
      admins: [session.user.email]
    });

    const saved = await newBranch.save();
    branch_id = saved._id;

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
        description,
        branch_id,
        creator_id,
        ) VALUES ($1, $2, $3, $4) RETURNING *`,
      [branch_id, description, name, session.user.email]
    );

    // Metadata for the posts of this branch
    await pool.query(
      `CREATE TABLE ${posts_metadata}.${pool.escapeIdentifier(branch_id)} (
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
  }
  catch (err) {
    await pool.query('ROLLBACK');

    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong creating branch / branch_post metadata.' }),
    };
  }

  await pool.query('COMMIT');
  
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