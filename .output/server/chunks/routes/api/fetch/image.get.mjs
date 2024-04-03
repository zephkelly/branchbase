import { e as eventHandler, g as getQuery } from '../user/get-id.get.mjs';
import * as cheerio from 'cheerio';
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

const image_get = eventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url;
  let imageArray = [];
  if (url.match(/imgur.com/g)) {
    imageArray = await handleImgur(url);
  }
  return {
    statusCode: 200,
    body: {
      imageLinks: imageArray
    }
  };
});
async function handleImgur(url) {
  let imageArray = [];
  let imgurUrl = url;
  if (url.match(/i.imgur.com/g)) {
    imageArray.push(url);
  } else if (url.match(/imgur.com\/a\//g) || url.match(/imgur.com\/gallery\//g) || url.match(/imgur.com\/t\/gallery\//g)) {
    imgurUrl = url.replace("imgur.com/a/", "imgur.com/gallery/");
    imageArray = await parseAlbum();
  } else {
    imgurUrl = url.replace("https://", "");
    imgurUrl = imgurUrl.replace("http://", "");
    imgurUrl = imgurUrl.replace("www.", "");
    imgurUrl = imgurUrl.replace("imgur.com/", "");
    imageArray.push(`https://i.imgur.com/${imgurUrl}.jpg`);
  }
  return imageArray;
  async function parseAlbum() {
    const body = await (async () => {
      const response = await fetch(imgurUrl + "/hit.json");
      return await response.text();
    })();
    const $ = cheerio.load(body);
    const bodyText = $("body").html();
    const bodyParsed = JSON.parse(bodyText);
    const albumImages = bodyParsed.data.image.album_images;
    const images = albumImages.images.map((image) => {
      return `https://i.imgur.com/${image.hash + image.ext}`;
    });
    return images;
  }
}

export { image_get as default };
//# sourceMappingURL=image.get.mjs.map
