import { pool } from '~~/server/postgres';
import { BranchModel } from '~~/models/branches';

import dotenv from 'dotenv';
dotenv.config();

export default eventHandler(async (event) => {
  const body = await readBody(event);
  const { name, description } = body;

  const doesExist = await doesBranchExist(name);
  if (doesExist.rows[0].exists) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Branch already exists.' }),
    };
  }
  
  await createBranchMeta(name, description, name);
  await createBranchPostsCollection(name, description);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Branch created successfully.' }),
  };
});

async function doesBranchExist(branchName: string) {
  return await pool.query(
    'SELECT EXISTS (SELECT FROM branches WHERE name = $1)',
    [branchName]
  );
}

async function createBranchMeta(name: string, description: string, posts_collection: string) {
  return await pool.query(
    'INSERT INTO branches (name, description, posts_collection) VALUES ($1, $2, $3) RETURNING *',
    [name, description, posts_collection]
  );
}

async function createBranchPostsCollection(name: string, description: string) {
  const newBranch = await BranchModel.create({ branch_id: name });
  return await newBranch.save();
}