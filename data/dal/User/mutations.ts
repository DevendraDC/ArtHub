"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type userData = {
  id: string;
  name: string;
  username: string;
  bio: string;
  image: string | null;
  portfolio: string | undefined;
  location: string;
};

export const updateUser = async (userData: userData) => {
  try {
    await prisma.user.update({
      where: {
        id: userData.id,
      },
      data: {
        ...(userData.image && { image: userData.image }),
        name: userData.name,
        username: userData.username,
        bio: userData.bio,
        portfolio: userData.portfolio,
        location: userData.location,
      },
    });

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("error while updating user", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "error while updating user",
    };
  }
};
