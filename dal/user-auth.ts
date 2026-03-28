"use server";

import { auth } from "@/src/lib/better-auth/auth";
import { authSchema } from "@/src/utils/zodSchema";
import { headers } from "next/headers";
import z from "zod";

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
        name: ""
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("error occured while creating user");
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "error occured while creating user",
    };
  }
};

export const loginUser = async (data: z.infer<typeof authSchema>) => {
  try {
    const { email, password } = data;
    if (!email || !password) {
      throw new Error("email and password are required");
    }

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Some error occured while signing in user");
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Some error occured while signing in user",
    };
  }
};
