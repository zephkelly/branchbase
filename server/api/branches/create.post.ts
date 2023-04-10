import { getServerSession } from '#auth'
import { pool } from '~~/server/postgres';

import mongoose from 'mongoose';
import { Branches, Branch_Metadata, BranchCollections } from '~~/models/branches';

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
  if (validateQuery(branch_description, branch_type) == false) {
    return {
      success: false,
      message: "The details you input are invalid, message too long or missing"
    }
  }

  if (branch_type != "public" && branch_type != "private") {
    return {
      success: false,
      message: "The branch type is invalid"
    }
  }

  if (validateQueryCustom(branch_name, 1, 21) == false) {
    return {
      success: false,
      message: "The branch name is too long or too short (1-21 chars)"
    }
  }

  //Check if branch exists
  const doesBranchExist = pool.query(`
    SELECT branch_name FROM branches WHERE branch_name = $1
  `, [branch_name]);

  if (doesBranchExist.rowCount > 0) {
    return {
      success: false,
      message: "Branch with that name already exists"
    }
  }

  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  const user_id = regexDisplayIdRaw(user_display_name as string);

  try {
    const branch: Branches = {
      branch_name: branch_name,
      icon_image: "",
      branch_type: branch_type,
      description: branch_description,
      created_date: new Date(),
      updated_date: new Date()
    }

    const branch_result = await pool.query(`
      INSERT INTO branches (branch_name, icon_image, branch_type, description, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        branch.branch_name,
        branch.icon_image,
        branch.branch_type,
        branch.description,
        branch.created_date,
        branch.updated_date
      ]
    );

    const branch_metadata: Branch_Metadata = {
      branch_id: branch_result.rows[0].id,
      branch_title: branch_name,
      creator_user_id: user_id,
      owner_user_id: user_id,
      background_image: ""
    }

    //Create branch metadata
    const branch_metadata_result = await pool.query(`
      INSERT INTO branch_metadata (branch_id, branch_title, creator_user_id, owner_user_id, background_image)
      VALUES ($1, $2, $3, $4, $5)`,
    [
      branch_metadata.branch_id,
      branch_metadata.branch_title,
      branch_metadata.creator_user_id,
      branch_metadata.owner_user_id,
      branch_metadata.background_image
    ]);

    //Create branch post store from BranchCollection model mogoose
    const branchStore = new BranchCollections({
      branch_id: branch_result.rows[0].id,
      branch_pages: [],
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
