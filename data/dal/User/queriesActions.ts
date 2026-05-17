"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { fetchPostsProfile } from "../Post/queriesActions";


export type ProfileData =
  | { type: "posts"; data: Awaited<ReturnType<typeof fetchPostsProfile>> }
  | { type: "saved"; data: [] }
  | { type: "followers"; data: Awaited<ReturnType<typeof getFollowers>> }
  | { type: "following"; data: Awaited<ReturnType<typeof getFollowing>> };

export const getUsers = cache(async (keyword: string) => {
  try {
    return await prisma.user.findMany({
      where: {
        ...(keyword.trim() && {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { username: { contains: keyword, mode: "insensitive" } },
          ],
          AND: { role: "USER" },
        }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      orderBy: {
        followers: {
          _count: "desc",
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
});

export const usernameExist = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return !!user;
};


export const getProfileData = cache(
  async (tab: number, userId: string): Promise<ProfileData | null> => {
    try {
      if (tab === 0)
        return {
          type: "posts" as const,
          data: await fetchPostsProfile(userId),
        };
      if (tab === 1) return { type: "saved" as const, data: [] as [] };
      if (tab === 2)
        return { type: "followers" as const, data: await getFollowers(userId) };
      if (tab === 3)
        return { type: "following" as const, data: await getFollowing(userId) };
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
);


const getFollowers = cache(async (userId: string) => {
  return await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    select: {
      follower: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

const getFollowing = cache(async (userId: string) => {
  return await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      following: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});