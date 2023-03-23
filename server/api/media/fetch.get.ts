//Look up cheerio to scrape imgur gallery urls

import * as cheerio from 'cheerio';

export default eventHandler(async (event) => {
  const body = await (async () => {
    const query = getQuery(event);
    const url = query.url as string;

    const response = await fetch(url + '/hit.json');
    return await response.text();
  })();

  const $ = cheerio.load(body);

  const bodyText: any = $('body').html();
  const bodyParsed = JSON.parse(bodyText);

  const albumImages = bodyParsed.data.image.album_images;

  const albumImagesArray = albumImages.images.map((image: any) => {
    console.log(image)
    return image.hash + image.ext;
  });

  return {
    statusCode: 200,
    body: {
      imgurHashes: albumImagesArray
    }
  };
});