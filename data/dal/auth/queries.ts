"use server";

import { auth } from "@/lib/better-auth/auth";
import { authSchema } from "@/validators/user";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import z from "zod";

type betterAuthError = {
  status: string;
  body: {
    message: string;
    code: string;
  };
};

export const signupUser = async (data: z.infer<typeof authSchema>) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error("email and password both are required");
    }
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "",
      },
    });

    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "email-verification",
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("error occured while creating user, error:", error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.body?.message ?? "Verification failed",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const loginUser = async (data: z.infer<typeof authSchema>) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error("email and password are required");
    }

    const {user} = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
    if(!user.emailVerified){
      throw new Error("email not verified");
    }
    return { success: true };
  } catch (error) {
    console.error("error occured while signing in, error:", error);
    if (error instanceof APIError) {
      return {
        success: false,
        error: error.body?.message ?? "Verification failed",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

export const verifyEmail = async (otp: string, email: string) => {
  try {
    if (otp.length < 6) {
      throw new Error("Please enter the complete 6 digit verification code");
    }

    await auth.api.verifyEmailOTP({
      body: { email, otp },
    });

    return { success: true };
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      return {
        success: false,
        error: error.body?.message ?? "Verification failed",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};
