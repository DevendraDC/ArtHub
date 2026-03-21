"use server";

import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";
import { cache } from "react";
import { uploadMultipleImages } from "../utils/cloudinary";
import { getUserSession } from "../utils/getUserSession";

export async function postUpload(formData: FormData) {
  try {
    const authorId = formData.get("authorId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.getAll("tags") as string[];
    const artImages = formData.getAll("images") as File[];
    const medium = formData.getAll("mediums") as PostMedium[];

    if (!authorId || !title || medium.length === 0 || artImages.length === 0) {
      throw new Error("please fill the required fields");
    }
    const uploadedImages = await uploadMultipleImages(artImages);
    await prisma.artPost.create({
      data: {
        authorId,
        title,
        description,
        medium,
        tags,
        artImages: {
          create: uploadedImages.map((img, i) => ({
            url: img.secure_url,
            order: i,
          })),
        },
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "failed to publish post",
    };
  }
}

export const getPosts = cache(async (filter: number) => {
  try {
    const session = await getUserSession();
    if (filter === 1) {
      return await prisma.artPost.findMany({
        where: {
          user: {
            followers: { some: { followerId: session.user.id } },
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
    } else if (filter === 2) {
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
    }
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
    return [];
  }
});

export type Posts = Awaited<ReturnType<typeof getPosts>>;

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

export const getPostDetails = cache(async (postId: string, userId: string) => {
  try {
    const postDetails = await prisma.artPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        _count: {
          select: {
            comments: true,
            likes: true,
            usersSaved: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            followers: {
              where: {
                followerId: userId,
              },
            },
            _count: {
              select: {
                followers: true,
                following: true,
                artPosts: true,
              },
            },
          },
        },
        id: true,
        medium: true,
        tags: true,
        createdAt: true,
        title: true,
        description: true,
        likes: {
          where: {
            ownerId: userId,
          },
        },
      },
    });
    return postDetails;
  } catch (error) {
    console.error(error);
    return null;
  }
});

export type PostDetails = Awaited<ReturnType<typeof getPostDetails>>;

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
