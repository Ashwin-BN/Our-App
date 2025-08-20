import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.id, name: user.name, email: user.email };
        }
        return null;
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

      let existingUser = await prisma.user.findUnique({ where: { email: user.email } });

      // Link OAuth account if exists
      if (existingUser && account.provider !== "credentials") {
        await prisma.account.upsert({
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

      // Create user if not exists
      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            name: user.name || profile?.name || "No Name",
            email: user.email,
            image: user.image || profile?.picture || null,
          },
        });
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) token.email = user.email;

      // Save OAuth access token
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = Date.now() + 3600 * 1000; // 1 hour expiry
      }

      // Check if user has password
      if (token.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        token.hasPassword = !!dbUser?.password;
      }

      return token;
    },

    async session({ session, token }) {
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
