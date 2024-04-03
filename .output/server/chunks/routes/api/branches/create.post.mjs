import { e as eventHandler, r as readBody, p as pool } from '../user/get-id.get.mjs';
import { p as perspective } from '../../../_/perspective.mjs';
import { v as validateQueryLength, i as isInputAppropriate } from '../../../_/validation.mjs';
import { r as regexDisplayIdRaw } from '../../../_/filterName.mjs';
import { g as getServerSession } from '../../../_/nuxtAuthHandler.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'requrl';
import 'pg';
import 'dotenv';
import 'sharp';
import 'node:fs';
import 'node:url';
import 'googleapis';
import 'next-auth/core';

function validateBranchName(value, returnBool = false) {
  let passedValiation = true;
  if (value.length > 21) {
    value = value.slice(0, 21);
    passedValiation = false;
  }
  if (value.includes(" ")) {
    value = value.replace(/\s/g, "");
    passedValiation = false;
  }
  if (value.match(/[^a-zA-Z0-9-]/g)) {
    value = value.replace(/[^a-zA-Z0-9-]/g, "");
    passedValiation = false;
  }
  if (value.match(/--/g)) {
    value = value.replace(/--/g, "-");
    passedValiation = false;
  }
  if (returnBool) {
    return passedValiation;
  } else {
    return value;
  }
}

const create_post = eventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  const session = await getServerSession(event);
  const { branch_name, branch_description, branch_type } = body;
  const user_email = (_a = session == null ? void 0 : session.user) == null ? void 0 : _a.email;
  const user_display_name = (_b = session == null ? void 0 : session.user) == null ? void 0 : _b.name;
  if (!session) {
    return {
      success: false,
      field: "user",
      message: "You are not logged in"
    };
  } else if (user_email == null || user_email == void 0) {
    return {
      success: false,
      field: "user",
      message: "You are not logged in"
    };
  }
  if (branch_type != "public" && branch_type != "private") {
    return {
      success: false,
      field: "branch_type",
      message: "Branch visibility is invalid"
    };
  }
  if (validateQueryLength(branch_description) == false) {
    return {
      success: false,
      field: "branch_description",
      message: "The description is too long or missing!"
    };
  }
  if (validateBranchName(branch_name, true) == false) {
    return {
      success: false,
      field: "branch_name",
      message: "The branch name is invalid"
    };
  }
  if (!isInputAppropriate(await perspective(branch_name))) {
    return {
      success: false,
      field: "branch_name",
      message: "Branch name has been auto-flagged as inappropriate, please change it"
    };
  }
  if (!isInputAppropriate(await perspective(branch_description))) {
    return {
      success: false,
      field: "branch_description",
      message: "Branch description has been auto-flagged as inappropriate, please change it"
    };
  }
  const doesBranchExist = await pool.query(`
    SELECT branch_name FROM branches WHERE branch_name = $1
  `, [branch_name]);
  if (doesBranchExist.rowCount > 0) {
    console.log(doesBranchExist);
    return {
      success: false,
      field: "branch_name",
      message: "Sorry, that name is already in use!"
    };
  }
  const user_id = regexDisplayIdRaw(user_display_name);
  await pool.query("BEGIN");
  try {
    const branch = {
      branch_name,
      branch_title: branch_name,
      description: branch_description,
      branch_type,
      creator_user_id: user_id,
      owner_user_id: user_id,
      icon_image: "",
      background_image: "",
      tags: [""],
      // pages: [""],
      updated_at: /* @__PURE__ */ new Date(),
      created_at: /* @__PURE__ */ new Date()
    };
    await pool.query(`
      Insert INTO branches (branch_name, branch_title, description, branch_type, creator_user_id, owner_user_id, icon_image, background_image, tags, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `, [branch.branch_name, branch.branch_title, branch.description, branch.branch_type, branch.creator_user_id, branch.owner_user_id, branch.icon_image, branch.background_image, branch.tags, branch.created_at, branch.updated_at]);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log(error);
    return {
      success: false,
      field: "branches",
      message: "There was an error creating the branch"
    };
  }
  await pool.query("COMMIT");
  return {
    success: true,
    field: "branches",
    message: "Branch created successfully"
  };
});

export { create_post as default };
//# sourceMappingURL=create.post.mjs.map
