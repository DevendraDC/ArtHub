"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { PostMedium } from "@/lib/generated/prisma/enums";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { Prisma } from "@/lib/generated/prisma/client";

export type PostWithUser = {
  id: string;
  thumbnail: string;
  tags: string[];
  mediums: PostMedium[];
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
};

export const getPosts = cache(
  async (filter: number, cursor?: string, take = 20) => {
    try {
      switch (filter) {
        case 1: {
          const posts = await prisma.post.findMany({
            take: take + 1, 
            ...(cursor && {
              cursor: { id: cursor },
              skip: 1, 
            }),
            select: {
              id: true,
              thumbnail: true,
              createdAt: true,
              mediums: true,
              tags: true,
              user: {
                select: { id: true, name: true, username: true, image: true },
              },
            },
            orderBy: { createdAt: "desc" },
          });

          const hasNextPage = posts.length > take;
          const data = hasNextPage ? posts.slice(0, -1) : posts; 
          const nextCursor = hasNextPage ? data[data.length - 1].id : null;

          return { data, nextCursor };
        }

        case 0: {
          const posts = await prisma.$queryRaw<PostWithUser[]>`
          SELECT
            p.id,
            p.thumbnail,
            p."createdAt",
            to_json(p.mediums) AS mediums,
            p.tags,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'username', u.username,
              'image', u.image
            ) AS user,
            (
              (COUNT(DISTINCT l."ownerId") * 3) +
              (COUNT(DISTINCT c."ownerId") * 2)
            ) / (
              EXTRACT(EPOCH FROM (NOW() - p."createdAt")) / 3600 + 2
            )::float AS score
          FROM "post" p
          LEFT JOIN "user" u ON u.id = p."authorId"
          LEFT JOIN "like" l ON l."artPostId" = p.id
          LEFT JOIN "comment" c ON c."artPostId" = p.id
          WHERE p."createdAt" > NOW() - INTERVAL '7 days'
          ${cursor ? Prisma.sql`AND p.id < ${cursor}` : Prisma.empty}
          GROUP BY p.id, u.id
          ORDER BY score DESC
          LIMIT ${take + 1}
        `;

          const hasNextPage = posts.length > take;
          const data = hasNextPage ? posts.slice(0, -1) : posts;
          const nextCursor = hasNextPage ? data[data.length - 1].id : null;

          return { data, nextCursor };
        }

        default:
          return { data: [], nextCursor: null };
      }
    } catch (error) {
      console.error(error);
      return { data: [], nextCursor: null };
    }
  },
);

export type Posts = Awaited<ReturnType<typeof getPosts>>;

export const getPostDetails = cache(async (postId: string) => {
  try {
    const userId = (await headers()).get("user-id");
    if (!userId) throw new Error("session not found");
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
      return await prisma.post.findMany({
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
              profileId: true,
              user: {
                select: {
                  name: true,
                  username: true,
                  image: true,
                },
              },
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
