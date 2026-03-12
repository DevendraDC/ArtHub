"use server";

import { prisma } from "@/src/lib/prisma";

export const verifyUser = async (code: string, email: string) => {
  try {
    const storedCode = await prisma.verifiyUser.findUnique({
      where: {
        email_verificationCode: { email, verificationCode: code },
      },
    });
    if (!storedCode) {
      throw new Error("invalid verification code!");
    }
    if (storedCode.expiresAt < new Date()) {
      throw new Error("verification code has expired!");
    }

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });

    await prisma.verifiyUser.deleteMany({
      where: {
        email,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error while verifying user");
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error while verifying user",
    };
  }
};
