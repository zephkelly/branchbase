import { NuxtAuthHandler } from "#auth";
import { pool } from "~~/server/plugins/postgres";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    //@ts-expect-error
    GithubProvider.default({
      clientId: process.env.GHUB_CLIENT_ID!,
      clientSecret: process.env.GHUB_CLIENT_SECRET!,
      async profile(profile: any) {
        return await setJWT(profile);
      }
    }),
    //@ts-expect-error
    DiscordProvider.default({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      async profile(profile: any) {
        return await setJWT(profile);
      }
    }),
    //@ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile: any) {
        profile.id = profile.sub;
        return await setJWT(profile);
      }
    }),
    //@ts-expect-error
    CredentialsProvider.default({
        id: 'credentials',
        name: 'Credentials',
        async authorize(credentials: any) {
            const { email, password } = credentials;

            const findUserQuery = `
          SELECT u.id, u.email, u.password, u.auth_provider, um.display_name, um.avatar_url
          FROM users u
          JOIN user_metadata um ON u.id = um.user_id
          WHERE u.email = $1;
        `;

            const result = await pool.query(findUserQuery, [credentials.email]);

            const userObject = {
                name: `${result.rows[0].display_name}*${result.rows[0].id}`,
                email: result.rows[0].email,
                image: result.rows[0].avatar_url,
                id: result.rows[0].user_id
            };

            if (result.rowCount == 0) {
                console.error("User not found");
            }

            if (result.rows[0].auth_provider != "email") {
                console.error("User is not signed up via email, sign-in using the correct provider");
            }

            const passwordMatch = await bcrypt.compare(credentials.password, result.rows[0].password);

            if (!passwordMatch) {
                console.error("Passwords don't match");
            }

            return userObject;
        },
    })
  ]
});

async function setJWT(profile: any) {
  const findUserQuery = `
    SELECT u.id, um.display_name, um.avatar_url
    FROM users u
    JOIN user_metadata um ON u.id = um.user_id
    WHERE u.email = $1;
  `;

  const result = await pool.query(findUserQuery, [profile.email]);

  if (result.rowCount > 0) {

    profile.name = `${result.rows[0].display_name}*${result.rows[0].id}`;
    profile.image = result.rows[0].avatar_url;
  }

  return profile;
}