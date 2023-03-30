import { NuxtAuthHandler } from "#auth";
import { UserModel } from "~~/models/user";
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
    //@ts-expect-error
    GithubProvider.default({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    //@ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    //@ts-expect-error
    CredentialsProvider.default({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials: any) {
          const { email, password } = credentials;

          const user = await UserModel.find({ email: email });

          if (user.length == 0) {
            return null
          }
          else {
            // @ts-ignore
            await bcrypt.compare(password, user[0].password, (err, match) => {
              if (match) {
                const userObject = {
                  name: "Zeph",
                  email: user[0].email,
                  image: ""
                }

                return userObject;
              }
              else {
                return null;
              }
            });
          }
      }
    })
  ]
});