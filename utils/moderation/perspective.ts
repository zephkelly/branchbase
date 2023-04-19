import { google } from 'googleapis';

export async function runSample(sample: string) {
  try {
    // @ts-ignore
    const client = await google.discoverAPI(process.env.GOOGLE_DICOVERY_URL);

    const analyzeRequest = {
      comment: {
        text: sample,
      },
      requestedAttributes: {
        TOXICITY: {},
        THREAT: {},
        SEVERE_TOXICITY: {},
        INSULT: {},
        PROFANITY: {},
        IDENTITY_ATTACK: {},
      },
      languages: ['en', 'es'],
    };

    // @ts-ignore
    const response = await client.comments.analyze({key: process.env.GOOGLE_API_KEY, resource: analyzeRequest});

    return response.data;
  } catch (err) {
    throw err;
  }
}