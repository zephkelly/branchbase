import { NuxtAuthHandler } from "#auth";
import { pool } from "~~/server/plugins/postgres";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export default NuxtAuthHandler({
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      async profile(profile: any) {
        return await setJWT(profile);
      }
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      async profile(profile: any) {
        return await setJWT(profile);
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile: any) {
        return await setJWT(profile);
      }
    }),
    CredentialsProvider({
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

            const result = await pool.query(findUserQuery, [email]);

            const userObject = {
                name: `${result.rows[0].display_name}*${result.rows[0].id}`,
                email: result.rows[0].email,
                image: result.rows[0].avatar_url,
                // id: result.rows[0].user_id
            };

            if (result.rowCount == 0) {
                console.error("User not found");
            }

            if (result.rows[0].auth_provider != "email") {
                console.error("User is not signed up via email");
            }

            const passwordMatch = await bcrypt.compare(password, result.rows[0].password);

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