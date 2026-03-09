import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import EmailVerificationCode from "@/components/auth/EmailTemplate";
import crypto from "crypto";
import { nextCookies } from "better-auth/next-js";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    additionalFields: {
      username: { type: "string", unique : true },
      bio: { type: "string", defaultValue: "" },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user }, request) => {
      const code = crypto.randomInt(100000, 1000000);
      const vCode = code.toString();
      await prisma.verifiyUser.create({
        data: {
          email: user.email,
          verificationCode: vCode,
          expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        },
      });
      resend.emails.send({
        from: "ArtHub <onboarding@resend.dev>",
        to: user.email,
        subject: "email verification",
        react: EmailVerificationCode(vCode),
      });
    },
    sendOnSignIn: true,
    sendOnSignUp: true,
  },
  plugins: [nextCookies()]
});
