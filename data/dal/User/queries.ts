"use server";

import { prisma } from "@/src/lib/prisma";
import { getUserSession } from "../getUserSession";
import { unstable_cache } from "next/cache";

export const getProfileSettingsData = unstable_cache(async () => {
  try {
    const userSession = await getUserSession();
    const data = await prisma.user.findUnique({
      where: {
        id: userSession.userId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        username: true,
        profileCreated: true,
        profile: {
          select: {
            bio: true,
            portfolio: true,
            location: true,
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
});

export type ProfileSettingsData = Awaited<
  ReturnType<typeof getProfileSettingsData>
>;

export const getUserData2 = async () => {
  try {
    const session = await getUserSession();
    const data = await prisma.profile.findUnique({
      where: {
        profileId: session.userId,
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
