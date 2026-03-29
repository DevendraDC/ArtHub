"use server";

import { prisma } from "@/src/lib/prisma";
import { cache } from "react";
import { getUserSession } from "./getUserSession";

export const getAllPosts = cache(async () => {
  try {
    return await prisma.artPost.findMany({
      select: {
        id: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },

        artImages: {
          orderBy: {
            order: "asc",
          },
          take: 1,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
});

export type AllPosts = Awaited<ReturnType<typeof getAllPosts>>;

export const getPopularPosts = cache(async () => {
  try {
    return await prisma.artPost.findMany({
      select: {
        id: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },

        artImages: {
          orderBy: {
            order: "asc",
          },
          take: 1,
          select: {
            url: true,
          },
        },
      },
      orderBy: { likes: { _count: "desc" } },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
});

export type PopularPosts = Awaited<ReturnType<typeof getPopularPosts>>;

export const getFollowingPosts = cache(async () => {
  try {
    const session = await getUserSession();
    return await prisma.artPost.findMany({
      where: {
        user: {
          followers: { some: { followerId: session.userId } },
        },
      },
      select: {
        id: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },

        artImages: {
          orderBy: {
            order: "asc",
          },
          take: 1,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
});

export type FollowingPosts = Awaited<ReturnType<typeof getFollowingPosts>>;


export const getArtImages = cache(async (postId: string) => {
  try {
    const images = await prisma.artImages.findMany({
      where: {
        postId,
      },
      select: {
        url: true,
        id: true,
      },
    });
    return images;
  } catch (error) {
    console.error(error);
    return [];
  }
});

export type ArtImages = Awaited<ReturnType<typeof getArtImages>>;

export const getPostComments = cache(async (postId: string) => {
  try {
    const postComments = await prisma.comment.findMany({
      where: {
        artPostId: postId,
      },
    });
    return postComments;
  } catch (error) {
    console.error(error);
    return [];
  }
});

export type PostComments = Awaited<ReturnType<typeof getPostComments>>;

export const toggleLike = async (artPostId: string, ownerId: string) => {
  const isLiked = await prisma.like.findUnique({
    where: {
      artPostId_ownerId: {
        artPostId,
        ownerId,
      },
    },
  });
  if (isLiked) {
    await prisma.like.delete({
      where: {
        artPostId_ownerId: {
          artPostId,
          ownerId,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        artPostId,
        ownerId,
      },
    });
  }
};

export const fetchPostsProfile = cache(async (userId: string) => {
  return await prisma.artPost.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    select: {
      id: true,
      createdAt: true,
      artImages: {
        orderBy: {
          order: "asc",
        },
        take: 1,
        select: {
          url: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

export type PostsProfile = Awaited<ReturnType<typeof fetchPostsProfile>>;
