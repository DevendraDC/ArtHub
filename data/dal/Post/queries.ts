import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { unstable_cache } from "next/cache";


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
