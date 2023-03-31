import { NuxtAuthHandler } from "#auth";
import { UserModel } from "~~/models/user";
import { pool } from "~~/server/postgres";
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
      async profile(profile: any) {
        const userProfile = await pool.query("SELECT * FROM user_profiles WHERE email = $1", [profile.email]);

        if (userProfile.rows.length == 0) {
          profile.name = userProfile.rows[0].display_name;
        }

        return profile;
      }
    }),
    //@ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile: any) {
        const userProfile = await pool.query("SELECT * FROM user_profiles WHERE email = $1", [profile.email]);

        if (userProfile.rows.length == 0) {
          profile.name = userProfile.rows[0].display_name;
        }
        
        return profile;
      }
    }),
    //@ts-expect-error
    CredentialsProvider.default({
      id: 'credentials',
      name: 'Credentials',
      async authorize(credentials: any) {
        const { email, password } = credentials;
        const user: any = await UserModel.find({ email: email });

        if (user.length == 0) {
          console.log("user not found")
          return Error("Email or password is incorrect");
        }

        if (user[0].auth_provider != "email") {
          console.log("user not email")
          return Error("Sorry but you didn't sign up with an email, please use the correct provider");
        }
        
        const match = await bcrypt.compare(password, user[0].password);

        if (!match) {
          console.log("passwords don't match")
          return Error("Email or password is incorrect");
        }

        const userProfile = await pool.query("SELECT * FROM user_profiles WHERE email = $1", [email]);

        const userObject = {
          name: userProfile.rows[0].display_name,
          email: user[0].email,
          image: ""
        };
          
        return userObject;
      }
    })
  ]
});