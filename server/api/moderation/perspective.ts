import { perspective } from '~~/utils/moderation/perspective';
import { getServerSession } from '#auth';

export default eventHandler(async (event: any) => {
  const session = await getServerSession(event);
  const ip = event.req.headers.host;

  if (!session?.user && ip !== 'localhost:3000') {
    return {
      statusCode: 401,
      status: 'unauthenticated!'
    }
  }

  const query = getQuery(event);

  const sample: string = query.sample as string;

  const results = await perspective(sample);

  return {
    statusCode: 200,
    body: {
      severeToxicity: results.attributeScores.SEVERE_TOXICITY.summaryScore.value,
      toxicity: results.attributeScores.TOXICITY.summaryScore.value,
      threat: results.attributeScores.THREAT.summaryScore.value,
      insult: results.attributeScores.INSULT.summaryScore.value,
      profanity: results.attributeScores.PROFANITY.summaryScore.value,
      identityAttack: results.attributeScores.IDENTITY_ATTACK.summaryScore.value,
      sexuallyExplict: results.attributeScores.SEXUALLY_EXPLICIT.summaryScore.value,
    }
  }
});