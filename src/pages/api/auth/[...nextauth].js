// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prismaClient from "../../../lib/prisma"; // singleton PrismaClient

export const authOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase();

        try {
          const user = await prismaClient.user.findUnique({
            where: { email },
          });

          if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
            return { id: user.id, name: user.name, email: user.email };
          }

          return null;
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      const email = user.email.toLowerCase();

      try {
        let existingUser = await prismaClient.user.findUnique({
          where: { email },
        });

        if (existingUser && account.provider !== "credentials") {
          await prismaClient.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
            },
          });
        }

        if (!existingUser) {
          existingUser = await prismaClient.user.create({
            data: {
              name: user.name || profile?.name || "No Name",
              email,
              image: user.image || profile?.picture || null,
            },
          });
        }

        return true;
      } catch (err) {
        console.error("SignIn callback error:", err);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) token.email = user.email.toLowerCase();

      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + 3600 * 1000; // 1 hour
      }

      if (token.email) {
        try {
          const dbUser = await prismaClient.user.findUnique({
            where: { email: token.email },
          });
          token.hasPassword = !!dbUser?.password;
        } catch (err) {
          console.error("JWT callback error:", err);
        }
      }

      if (user) token.id = user.id;

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.hasPassword = token.hasPassword;
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
