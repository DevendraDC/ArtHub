"use server";

import { prisma } from "@/src/lib/prisma";
import { getUserSession } from "../getUserSession";
import { cache } from "react";
import { PostMedium } from "@/src/lib/generated/prisma/enums";

export const getPosts = cache(async (filter: number) => {
  try {
    const session = await getUserSession();
    if (!session || !session.userId) throw new Error("session not found");
    return await prisma.artPost.findMany({
      where:
        filter === 1
          ? {
              user: {
                followers: { some: { followerId: session.userId } },
              },
            }
          : undefined,

      select: {
        id: true,
        createdAt: true,
        mediums: true,
        tags: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        artImages: {
          orderBy: { order: "asc" },
          take: 1,
          select: { url: true },
        },
      },

      orderBy:
        filter === 2 ? { likes: { _count: "desc" } } : { createdAt: "desc" },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
});

export type Posts = Awaited<ReturnType<typeof getPosts>>;

export const getPostDetails = cache(async (postId: string) => {
  try {
    const session = await getUserSession();
    const userId = session.userId;
    const postDetails = await prisma.artPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
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
            followers: {
              where: {
                followerId: userId,
              },
              select: {
                followerId: true,
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
        createdAt: true,
        title: true,
        description: true,
        likes: {
          where: {
            ownerId: userId,
          },
          select: {
            ownerId: true,
          },
        },
      },
    });
    return {
      postInfo: postDetails,
      sessionUserId: userId,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
});

export type PostDetails = Awaited<ReturnType<typeof getPostDetails>>;

export const getSearchedPosts = cache(
  async (
    selectedTags: string[],
    selectedMediums: PostMedium[],
    sortBy: string,
    keyword: string,
  ) => {
    try {
      return await prisma.artPost.findMany({
        where: {
          ...(selectedTags.length > 0 && {
            tags: {
              hasSome: selectedTags,
            },
          }),
          ...(keyword.trim() && {
            OR: [
              { title: { contains: keyword, mode: "insensitive" } },
              { description: { contains: keyword, mode: "insensitive" } },
            ],
          }),
          ...(selectedMediums.length > 0 && {
            medium: {
              hasSome: selectedMediums,
            },
          }),
        },
        select: {
          id: true,
          createdAt: true,
          mediums: true,
          tags: true,
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
          ...(sortBy === "latest"
            ? {
                createdAt: "desc",
              }
            : {
                likes: {
                  _count: "desc",
                },
              }),
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  },
);

export type SearchedPosts = Awaited<ReturnType<typeof getSearchedPosts>>;
