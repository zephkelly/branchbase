import { e as eventHandler } from './user/get-id.get.mjs';
import { g as getServerSession } from '../../_/nuxtAuthHandler.mjs';
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
import 'next-auth/core';

const session_get = eventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    return { status: "unauthenticated!" };
  }
  return {
    status: "authenticated!",
    text: "im protected by an in-endpoint check",
    session
  };
});

export { session_get as default };
//# sourceMappingURL=session.get.mjs.map
