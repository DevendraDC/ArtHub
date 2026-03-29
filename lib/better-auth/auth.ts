import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/src/lib/prisma";
import EmailVerificationCode from "@/src/components/EmailTemplate";
import crypto from "crypto";
import { nextCookies } from "better-auth/next-js";
import { transporter } from "../nodeMailer";
import { render } from "@react-email/render";  

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
      console.log("send")
      await transporter.sendMail({
        from: "ArtHub <devendradhundhwal766@gmail.com>",
        to: user.email,
        subject: "email verification",
        html: await render(EmailVerificationCode({ code: vCode })),
      });
    },
    sendOnSignIn: true,
    sendOnSignUp: true,
  },
  plugins: [nextCookies()],
});
