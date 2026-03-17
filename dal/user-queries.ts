"use server";

import { prisma } from "@/src/lib/prisma";
import { uploadImage } from "@/src/utils/cloudinary";

interface userDataType {
  id: string;
  email: string;
  image: File | null;
  name: string;
  username: string;
  bio: string;
}

enum getUserBy {
  ID,
  USERNAME,
  EMAIL,
}

interface param {
  type: getUserBy;
  val: string;
}

export const getUser = async (username: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
      NOT: {
        id: userId,
      },
    },
  });

  return user;
};

export const updateUser = async (userData: userDataType) => {
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
        name: userData.name,
        username: userData.username,
        bio: userData.bio,
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
