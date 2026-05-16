import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { transporter } from "../nodeMailer";
import { render } from "@react-email/render";
import { emailOTP } from "better-auth/plugins";
import EmailVerificationOtp from "@/components/EmailVerificationOTP";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
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
    sendOnSignUp: false,
  },
  plugins: [
    nextCookies(),
    emailOTP({
      expiresIn: 600,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          await transporter.sendMail({
            from: "ArtHub <devendradhundhwal766@gmail.com>",
            to: email,
            subject: "email verification",
            html: await render(
              EmailVerificationOtp({ userEmail: email, otpCode: otp }),
            ),
          });
        }
      },
    }),
  ],
});
