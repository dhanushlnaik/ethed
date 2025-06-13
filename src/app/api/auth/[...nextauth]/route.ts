import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

          // Import NextApiRequest from 'next'
          
          const csrfToken = (req as NextRequest).body?.csrfToken;

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: csrfToken,
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (error) {
          console.error("SIWE verification error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.address = token.sub;
      session.user.name = token.sub;
      session.user.image = "https://www.fillmurray.com/128/128";
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // optional: if you're customizing the sign-in page
  },
});

export { handler as GET, handler as POST };
