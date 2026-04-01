"use server";

import { prisma } from "@/src/lib/prisma";
import { uploadImage } from "@/src/lib/cloudinaryFunctions";
import { cache } from "react";
import { fetchPostsProfile } from "./posts";
import { getUserSession } from "./getUserSession";

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



export const toggleFollow = async (followerId: string, followingId: string) => {
  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });
  if (isFollowing) {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }
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
          profileId: true,
          user: {
              select: {
                username: true,
                name: true,
                image: true,
              },
            },
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
          profileId: true,
          user: {
              select: {
                username: true,
                name: true,
                image: true,
              },
            },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export type ProfileData =
  | { type: "posts"; data: Awaited<ReturnType<typeof fetchPostsProfile>> }
  | { type: "saved"; data: [] }
  | { type: "followers"; data: Awaited<ReturnType<typeof getFollowers>> }
  | { type: "following"; data: Awaited<ReturnType<typeof getFollowing>> };



export const getUsers = cache(async (keyword : string) => {
  try {
    return await prisma.user.findMany({
      where : {
        ...(keyword.trim() && {
          AND : [
            {name : {contains : keyword, mode : "insensitive"}},
            {username : {contains : keyword, mode : "insensitive"}},
            {role : "USER"}
          ]
        })
      },
      select : {
        id : true,
        name : true,
        username : true,
        image : true
      },
      orderBy : {
        profile: {
          followers: {
            _count: "desc"
          }
        }
      }
    })
  } catch (error) {
    console.error(error);
    return null;
  }
})
