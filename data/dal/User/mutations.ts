"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserSession } from "../getUserSession";

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

export const toggleFollow = async (followerId: string, followingId: string, isFollowing: boolean) => {
  if (isFollowing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  } else
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

  revalidatePath("/profile");
};


export const deleteUser = async () => {
  try {
    const session = await getUserSession();
    if(!session){
      throw new Error("session not found!");
    }
    if(!session.user.username || !session.user.name) {
      throw new Error("profile not created!");
    }
    await prisma.user.delete({
      where: {
        id: session.user.id
      }
    })
    revalidatePath("/", "layout");
    return {
      success: true
    }
  } catch (error) {
      console.error(error);
      return {
        success: false
      }
  }
}
