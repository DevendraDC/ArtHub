import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/src/lib/prisma";
import EmailVerificationCode from "@/src/components/EmailTemplate";
import crypto from "crypto";
import { nextCookies } from "better-auth/next-js";
import { transporter } from "../nodeMailer";
import { render } from "@react-email/render";  
import VerifyEmailTemplate from "@/src/components/EmailTemplate";

enum Role {
  USER,
  ADMIN
}

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
      role : {type : "string" , defaultValue : "USER"},
      username: { type: "string", unique: true, required : false},
      profileCreated: {type: "boolean", defaultValue: false}
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      await transporter.sendMail({
        from: "ArtHub <devendradhundhwal766@gmail.com>",
        to: user.email,
        subject: "email verification",
        html: await render(VerifyEmailTemplate(url)),
      });
    },
    sendOnSignIn: true,
    sendOnSignUp: true,
  },
  plugins: [nextCookies()],
});
