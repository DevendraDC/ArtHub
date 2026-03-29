"use server";

import { auth } from "@/src/lib/better-auth/auth";
import { authSchema } from "@/src/validators/user";
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
        name: "",
        username: email.split("@")[0]
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("error occured while creating user, error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : "Something went wrong while creating user",
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
      body: { email, password },
      headers: await headers(),
    });

    return { success: true };

  } catch (error) {
    console.error("error occured while signing in, error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : "Something went wrong while signing in",
    };
  }
};