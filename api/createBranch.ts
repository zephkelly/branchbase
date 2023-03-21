import { mongoose } from '@/plugins/mongo';
import { pool } from '@/plugins/postgres';
require('dotenv').config();

async function createBranch(name: string, description: string) {
  try {
    //Make sure that the branches table exists
    await pool.query(
      'CREATE TABLE IF NOT EXISTS branches (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT NOW(), posts_collection TEXT NOT NULL)'
    );

    // Insert the new branch into the branches table
    const newBranchMeta = await pool.query(
      'INSERT INTO branches (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );

    // Create a new collection in mongoDb for the branch using the name of the new database
    const newBranchCollection = await mongoose.createConnection(
      `${process.env.MONGO_CONNECTION + name}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Store the name of the new collection in the 'posts_collection' field of the branch in PostgreSQL
    await pool.query(
      'UPDATE branches SET posts_collection = $1 WHERE id = $2',
      [newBranchCollection.id, name]
    );
  }
  catch (err)
  {
    console.error(err);
    throw err;
  }
}