import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

export const getArtImages = unstable_cache(async (postId: string) => {
  try {
    const images = await prisma.postImages.findMany({
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

export const getPostInformation = cache(async (postId: string) => {
  try {
    const postInfo = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
        title: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        mediums: true,
        tags: true,
      },
    });
    return {
      success: true,
      data: postInfo,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
    };
  }
});

export type PostInformation = Awaited<ReturnType<typeof getPostInformation>>;

export const getPostTitleAndDesc = cache(async (postId: string) => {
  try {
    const postDetails = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            Collections: true,
          },
        },
        createdAt: true,
        title: true,
        description: true,
      },
    });
    return {
      success: true,
      data: postDetails,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
});

export const getPostStats = cache(async (postId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  try {
    const postDetails = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        _count: {
          select: {
            comments: true,
            likes: true,
            Collections: true,
          },
        },
        ...(session && {
          likes: {
            where: {
              ownerId: session.user.id,
            },
          },
        }),
      },
    });
    return {
      success: true,
      data: {
        post: postDetails,
        session: session,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
    };
  }
});

export type PostStatsType = Awaited<ReturnType<typeof getPostStats>>;
