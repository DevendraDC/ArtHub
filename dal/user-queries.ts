"use server";

import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/utils/upload-to-cloudinary";

interface userDataType {
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

export const getUser = async (inp: param) => {
  let user = null;
  if (inp.type === getUserBy.ID) {
    user = await prisma.user.findUnique({
      where: {
        id: inp.val,
      },
    });
  } else if (inp.type === getUserBy.EMAIL) {
    user = await prisma.user.findUnique({
      where: {
        email: inp.val,
      },
    });
  } else if (inp.type === getUserBy.USERNAME) {
    user = await prisma.user.findUnique({
      where: {
        username: inp.val,
      },
    });
  }

  return user;
};

export const updateUser = async (userData: userDataType) => {
  try {
    if (!userData.name || !userData.username) {
      throw new Error("name and username are required");
    }
    let img : string | null = null;
    if(userData.image){
      const res = await uploadImage(userData.image);
      img = res.secure_url
    }
    await prisma.user.update({
      where: {
        email: userData.email,
      },
      data: {
        image: img,
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
