import { getServerSession } from '#auth'

import formidable from "formidable";
import fs from "fs";

import { fileURLToPath } from 'url';
import path from "path";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  let imageUrl = "";
  let oldPath = "";
  let newPath = "";
  
  const form = formidable({ multiples: true, uploadDir: path.join("public", "uploads"), maxFileSize: 5 * 1024 * 1024 });
  const data = await new Promise((resolve, reject) => {
    form.parse(event.node.req, async (err, fields, files) => {
      if (err) {
        reject(err);
      }
      if (!files.photo) {
        resolve({
          status: "error",
          message: "Please upload a photo with name photo in the form",
        });
      }
      //@ts-ignore
      if (files.photo.mimetype.startsWith("image/")) {
        let imageName =
          Date.now() +
          Math.round(Math.random() * 100000) +
          //@ts-ignore
          files.photo.originalFilename;
        //@ts-ignore
        oldPath = files.photo.filepath;
        //@ts-ignore
        newPath = `${path.join("public", "uploads", imageName)}`;
        imageUrl = "./public/upload/" + imageName;

        // fs.rename(oldPath, newPath, (err) => {
        //   if (err) {
        //     console.log(err);
        //   }
        // });

        resolve({
          status: "ok",
          url: imageUrl,
        });
      } else {
        resolve({
          status: "error",
          message: "Please upload nothing but images.",
        });
      }
    });
  });
  return data;
});