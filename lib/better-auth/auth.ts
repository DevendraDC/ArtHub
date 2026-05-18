import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { transporter } from "../nodeMailer";
import { render } from "@react-email/render";
import VerifyEmailTemplate from "@/components/EmailTemplate";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "USER" },
      username: { type: "string", unique: true, required: false },
      bio: { type: "string", required: false },
      portfolio: { type: "string", required: false },
      location: { type: "string", required: false },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await transporter.sendMail({
        from: "ArtHub <silverisag54@gmail.com>",
        to: user.email,
        subject: "email verification",
        html: await render(VerifyEmailTemplate(url)),
      });
    },
  },
});
