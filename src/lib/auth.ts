import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/generated/prisma";
import { env } from "@/env";
import { emailOTP, siwe } from "better-auth/plugins";
import { sendMail } from "@/lib/mailer";
import { generateRandomString } from "better-auth/crypto";
import { verifyMessage, createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID!,
      clientSecret: env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendMail({
          to: email,
          subject: "EthEd - Verify your email",
          text: `Your verification code is: ${otp}`,
          html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
        });
      },
    }),
    siwe({
      domain: env.DOMAIN,
      anonymous: false,
      getNonce: async () => generateRandomString(32),
      verifyMessage: async ({ message, signature, address }) => {
        try {
          return await verifyMessage({
            address: address as `0x${string}`,
            message,
            signature: signature as `0x${string}`,
          });
        } catch (err) {
          console.error("❌ SIWE verification failed:", err);
          return false;
        }
      },
      ensLookup: async ({ walletAddress }) => {
        try {
          const client = createPublicClient({ chain: mainnet, transport: http() });
          const ensName = await client.getEnsName({ address: walletAddress as `0x${string}` });
          const ensAvatar = ensName ? await client.getEnsAvatar({ name: ensName }) : null;

          return { name: ensName || walletAddress, avatar: ensAvatar || "" };
        } catch {
          return { name: walletAddress, avatar: "" };
        }
      },
    }),
  ],
});
