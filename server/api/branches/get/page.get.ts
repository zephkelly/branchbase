import { pool } from '~~/server/postgres';
import { validateQuery } from '~~/utils/forms/validation';

import mongoose from 'mongoose';
import { Branch_Page_Metadata, Branch_Pages, BranchCollections } from '~~/models/branches';

export default eventHandler(async (event: any) => {
  const query = getQuery(event);
  const page_id: string = query.page_id as string;
  const branch_id: string = query.branch_id as string;

  //-----------------Validation-----------------
  if (!validateQuery(page_id, branch_id)) {
    console.log("Invalid query.")
    return {
      statusCode: 400,
      body: 'Invalid query.',
    };
  }

  if (await doesPageExist() === false) {
    console.log("Page doesn't exist.")
    return {
      statusCode: 200,
      body: 'Page doesn\'t exist',
    };
  }

  //-----------------Query-----------------
  const branchCollection = await BranchCollections.findOne({ branch_id: branch_id }).exec();
  
  if (branchCollection === null) {
    console.log("Branch collection doesn't exist.")
    return {
      statusCode: 200,
      body: 'Page doesn\'t exist.',
    };
  }

  const page = branchCollection.branch_pages.find((page: any) => page.page_id === page_id);

  if (page === undefined || page === null) {
    console.log("Page doesn't exist.")
    return {
      statusCode: 200,
      body: 'Page doesn\'t exist.',
    };
  }

  return {
    statusCode: 200,
    body: page,
  };

  //Helper functions --------------------------------------------
  async function doesPageExist() {
    const result = await pool.query(`
      SELECT * FROM branch_page_metadata WHERE page_id = $1
    `, [page_id]);

    if (result.rowCount === 0) {
      return false;
    }
    else {
      return true;
    }
  }
});
