//Look up cheerio to scrape imgur gallery urls

import * as cheerio from 'cheerio';

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const url = query.url as string;

  let imageArray = [];

  //Imgur
  if (url.match(/imgur.com/g)) {
    let imgurUrl = url;

    //Already an image
    if (url.match(/i.imgur.com/g)) {
      imageArray.push(url);
    }
    //Album or gallery
    else if (url.match(/imgur.com\/a\//g) || url.match(/imgur.com\/gallery\//g)) {
      imgurUrl = url.replace('imgur.com/a/', 'imgur.com/gallery/');
      imageArray = await handleImgur(imgurUrl);
    }
    //Single image
    else {
      //remove the first part of the url
      imgurUrl = url.replace('https://', '');
      imgurUrl = imgurUrl.replace('http://', '');
      imgurUrl = imgurUrl.replace('www.', '');
      imgurUrl = imgurUrl.replace('imgur.com/', '');

      imageArray.push(`https://i.imgur.com/${imgurUrl}.jpg`)
    }
  }

  return {
    statusCode: 200,
    body: {
      imageLinks: imageArray
    }
  };
});

async function handleImgur(url: string) {
  const body = await (async () => {
    const response = await fetch(url + '/hit.json');
    return await response.text();
  })();

  const $ = cheerio.load(body);

  const bodyText: any = $('body').html();
  const bodyParsed = JSON.parse(bodyText);

  const albumImages = bodyParsed.data.image.album_images;

  return albumImages.images.map((image: any) => {
    return `https://i.imgur.com/${image.hash + image.ext}`;
  });
}