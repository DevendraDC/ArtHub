"use server"

import { uploadImage } from "@/src/lib/cloudinaryFunctions";
import { prisma } from "@/src/lib/prisma";

type userData = {
  id: string | undefined;
  name: string;
  username: string;
  bio: string;
  image: File | null;
  email: string | undefined;
  portfolio: string | undefined;
  location: string;
};

export const updateUser = async (userData: userData) => {
  try {
    if (!userData.name || !userData.username) {
      throw new Error("name and username are required");
    }
    let img: string | null = null;
    if (userData.image) {
      const res = await uploadImage(userData.image);
      img = res.secure_url;
    }
    await prisma.user.update({
      where: {
        email: userData.email,
      },
      data: {
        ...(img && { image: img }),
        profileCreated: true,
        name: userData.name,
        username: userData.username,
        profile: {
          upsert: {
            create: {
              bio: userData.bio,
              portfolio: userData.portfolio,
              location: userData.location,
            },
            update: {
              bio: userData.bio,
              portfolio: userData.portfolio,
              location: userData.location,
            },
          },
        },
      },
    });

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
