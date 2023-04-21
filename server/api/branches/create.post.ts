import { getServerSession } from '#auth'
import { pool } from '~~/server/plugins/postgres';

import { Branches } from '~~/models/branches';

import { perspective } from '~~/utils/moderation/perspective';
import { validateQueryLength, validateQueryCustom, isInputAppropriate } from '~~/utils/forms/validation';
import { validateBranchName } from '~~/utils/branches/validation';
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
      field: "user",
      message: "You are not logged in"
    }
  }
  else if (user_email == null || user_email == undefined) {
    return {
      success: false,
      field: "user",
      message: "You are not logged in"
    }
  }

  if (branch_type != "public" && branch_type != "private") {
    return {
      success: false,
      field: "branch_type",
      message: "Branch visibility is invalid"
    }
  }

  if (validateQueryLength(branch_description) == false) {
    return {
      success: false,
      field: "branch_description",
      message: "The description is too long or missing!"
    }
  }

  if (validateBranchName(branch_name, true) == false) {
    return {
      success: false,
      field: "branch_name",
      message: "The branch name is invalid"
    }
  }
  
    if (!isInputAppropriate(await perspective(branch_name))) {
      return {
        success: false,
        field: "branch_name",
        message: "Branch name has been auto-flagged as inappropriate, please change it"
      }
    }

  if (!isInputAppropriate(await perspective(branch_description))) {
    return {
      success: false,
      field: "branch_description",
      message: "Branch description has been auto-flagged as inappropriate, please change it"
    }
  }

  //Check if branch exists
  const doesBranchExist = await pool.query(`
    SELECT branch_name FROM branches WHERE branch_name = $1
  `, [branch_name]);

  if (doesBranchExist.rowCount > 0) {
    return {
      success: false,
      field: "branch_name",
      message: "Sorry, that name is already in use!"
    }
  }

  const user_id = regexDisplayIdRaw(user_display_name as string);

  await pool.query('BEGIN');

  try {
    const branch: Branches = {
      branch_name: branch_name,
      branch_title: branch_name,
      description: branch_description,
      branch_type: branch_type,
      creator_user_id: user_id,
      owner_user_id: user_id,
      icon_image: "",
      background_image: "",
      tags: [""],
      // pages: [""],
      updated_at: new Date(),
      created_at: new Date()
    }

    await pool.query(`
      Insert INTO branches (branch_name, branch_title, description, branch_type, creator_user_id, owner_user_id, icon_image, background_image, tags, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `, [branch.branch_name, branch.branch_title, branch.description, branch.branch_type, branch.creator_user_id, branch.owner_user_id, branch.icon_image, branch.background_image, branch.tags, branch.created_at, branch.updated_at]);
  }
  catch (error) {
    await pool.query('ROLLBACK');

    console.log(error);

    return {
      success: false,
      field: "branches",
      message: "There was an error creating the branch"
    }
  }

  await pool.query('COMMIT');

  return {
    success: true,
    field: "branches",
    message: "Branch created successfully"
  }
});