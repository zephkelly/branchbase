import { e as eventHandler, g as getQuery } from '../user/get-id.get.mjs';
import { p as perspective$1 } from '../../../_/perspective.mjs';
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

const perspective = eventHandler(async (event) => {
  const session = await getServerSession(event);
  const ip = event.req.headers.host;
  if (!(session == null ? void 0 : session.user) && ip !== "localhost:3000") {
    return {
      statusCode: 401,
      status: "unauthenticated!"
    };
  }
  const query = getQuery(event);
  const sample = query.sample;
  const results = await perspective$1(sample);
  return {
    statusCode: 200,
    body: {
      severeToxicity: results.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      toxicity: results.attributeScores.TOXICITY.summaryScore.value,
      threat: results.attributeScores.THREAT.summaryScore.value,
      insult: results.attributeScores.INSULT.summaryScore.value,
      profanity: results.attributeScores.PROFANITY.summaryScore.value,
      identityAttack: results.attributeScores.IDENTITY_ATTACK.summaryScore.value,
      sexuallyExplict: results.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value
    }
  };
});

export { perspective as default };
//# sourceMappingURL=perspective.mjs.map
