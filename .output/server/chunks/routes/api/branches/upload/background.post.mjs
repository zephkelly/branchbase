import { d as defineEventHandler, p as pool } from '../../user/get-id.get.mjs';
import sharp from 'sharp';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { r as regexDisplayIdRaw } from '../../../../_/filterName.mjs';
import { g as getServerSession } from '../../../../_/nuxtAuthHandler.mjs';
import 'node:http';
import 'node:https';
import 'requrl';
import 'pg';
import 'dotenv';
import 'node:fs';
import 'node:url';
import 'next-auth/core';

const background_post = defineEventHandler(async (event) => {
  var _a;
  const session = await getServerSession(event);
  if (!session) {
    return {
      statusCode: 401,
      body: "You are not logged in"
    };
  }
  const form = formidable({ multiples: true, uploadDir: path.join("public", "uploads", "branches", "backgrounds"), maxFileSize: 5 * 1024 * 1024 });
  const data = await new Promise((resolve, reject) => {
    form.parse(event.node.req, (err, fields, files) => {
      if (err) {
        console.log(err);
        reject(err);
        return {
          statusCode: 400,
          error: err
        };
      }
      resolve({
        fields,
        files
      });
    });
  });
  const file = data.files.photo;
  const previousBackroundImage = data.fields.background_image;
  const top = data.fields.top === "" ? 0 : Math.abs(parseInt(data.fields.top));
  const user_id = regexDisplayIdRaw((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.name);
  const branchId = data.fields.branch;
  const fileName = file.newFilename;
  const newFileName = file.newFilename + ".webp";
  const filePath = path.join("public", "uploads", "branches", "backgrounds", `${fileName}`);
  const mewFilePath = filePath + ".webp";
  try {
    const isAuthorisedResult = await pool.query(`
      SELECT id FROM branches WHERE id = $1 AND owner_user_id = $2
    `, [branchId, user_id]);
    if (isAuthorisedResult.rowCount == 0) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
      return {
        statusCode: 401,
        body: "You are not authorised to make changes to this branch."
      };
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      error: err
    };
  }
  sharp(filePath).resize(1920, 1200).extract({ left: 0, top, width: 1920, height: 400 }).webp({ quality: 80 }).toFile(mewFilePath, (err, info) => {
    fs.unlink(filePath, (err2) => {
      if (err2) {
        console.error(err2);
      }
    });
    if (previousBackroundImage) {
      const previousImagePath = "./public" + previousBackroundImage;
      fs.unlink(previousImagePath, (err2) => {
        if (err2) {
          console.error(err2);
        }
      });
    }
    if (err) {
      console.log(err);
      return {
        statusCode: 400,
        error: err
      };
    }
  });
  await pool.query(`BEGIN`);
  try {
    const backgroundPath = "/uploads/branches/backgrounds/" + newFileName;
    await pool.query(`
      UPDATE branches SET background_image = $1 WHERE id = $2
    `, [backgroundPath, branchId]);
  } catch (err) {
    console.log(err);
    await pool.query(`ROLLBACK`);
    return {
      statusCode: 400,
      error: err
    };
  }
  await pool.query(`COMMIT`);
  return {
    statusCode: 200,
    body: "Background image updated."
  };
});

export { background_post as default };
//# sourceMappingURL=background.post.mjs.map
