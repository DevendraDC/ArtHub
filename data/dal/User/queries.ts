"use server";

import { prisma } from "@/lib/prisma";
import { getUserSession } from "../getUserSession";
import { cache } from "react";

export const getProfileSettingsData = cache(async (userId: string) => {
  try {
    const session = await getUserSession();
    if (!session || !session.user.id) throw new Error("Session not found");
    const data = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        username: true,
        bio: true,
        portfolio: true,
        location: true,
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
});
export type ProfileSettingsData = Awaited<
  ReturnType<typeof getProfileSettingsData>
>;

export const getUserData2 = async () => {
  try {
    const session = await getUserSession();
    if (!session || !session.user.id) throw new Error("Session not found");
    const data = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        bio: true,
        _count: {
          select: {
            artPosts: true,
            followers: true,
            following: true,
            likes: true,
          },
        },
      },
    });
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
};

export const usernameExist = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return !!user;
};

export const getProfile = cache(async (username: string) => {
  try {
    const session = await getUserSession();
    if (!session || !session.user.id) throw new Error("Session not found");
    if(!session.user.username) throw new Error("profile not found")
    const user = await prisma.user.findUnique({
      where: {
        username
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        email: true,
        bio: true,
        location: true,
        portfolio: true,
        followers: {
          where: {
            followerId: session.user.id,
          },
        },
        _count: {
          select: {
            artPosts: true,
            followers: true,
            following: true,
          },
        },
      },
    });
    return {
      success: true,
      userData: user,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
});

export type UserProfile = Awaited<ReturnType<typeof getProfile>>;
