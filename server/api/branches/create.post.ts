import { getServerSession } from '#auth'
import { pool } from '~~/server/postgres';

import mongoose from 'mongoose';
import { Branches_Metadata, BranchPostStore } from '~~/models/branches';

import { validateQuery } from '~~/utils/validateQuery';
import { regexDisplayIdRaw } from '~~/utils/filterName';

//Creat branch post
export default eventHandler(async (event: any) => {
  const body = await readBody(event);
  const session = await getServerSession(event);

  const { branch_name, branch_description, branch_type } = body;
  const user_email: string | null | undefined = session?.user?.email;
  const user_display_name: string | null | undefined = session?.user?.name;

  //--------------------Validation--------------------
  //Check if user is logged in
  //
  if (!session) {
    return { 
      success: false,
      message: "You are not logged in"
    }
  }
  else if (user_email == null || user_email == undefined) {
    return {
      success: false,
      message: "You are not logged in"
    }
  }

  //Validate the query
  if (validateQuery(branch_name, branch_description, branch_type) == false) {
    return {
      success: false,
      message: "The details you input are invalid, message too long or missing"
    }
  }

  //Check if branch exists
  const doesBranchExist = pool.query(`
    SELECT branch_name FROM branches_metadata WHERE branch_name = $1
  `, [branch_name]);

  if (doesBranchExist.rowCount > 0) {
    return {
      success: false,
      message: "Branch with that name already exists"
    }
  }

  //--------------------Create Branch--------------------
  //
  await pool.query('BEGIN');
  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  const user_id = regexDisplayIdRaw(user_display_name as string);

  try {
    const branch_metadata: Branches_Metadata = {
      branch_name: branch_name,
      creator_user_id: user_id,
      owner_user_id: user_id,
      branch_type: branch_type,
      description: branch_description,
      created_date: new Date(),
      updated_date: new Date(),
    }

    //Create branch metadata returning the id
    const branch_metadata_result = await pool.query(`
      INSERT INTO branches_metadata (branch_name, creator_user_id, owner_user_id, branch_type, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `,
      [branch_metadata.branch_name,
      branch_metadata.creator_user_id,
      branch_metadata.owner_user_id,
      branch_metadata.branch_type,
      branch_metadata.description
      ]
    );

    console.log(branch_metadata_result)

    //Create branch post store from BranchPostStore model mogoose
    const branchStore = new BranchPostStore({
      branch_id: branch_metadata_result.rows[0].id,
      posts: [],
    });

    await branchStore.save();
  }
  catch (error) {
    await pool.query('ROLLBACK');
    await mongoSession.abortTransaction();

    console.log(error);

    return {
      success: false,
      message: "There was an error creating the branch"
    }
  }

  await pool.query('COMMIT');
  await mongoSession.commitTransaction();

  return {
    success: true,
    message: "Branch created successfully"
  }
});
