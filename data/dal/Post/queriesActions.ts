"use server";

import { PostMedium } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { cache } from "react";

export type PostWithUser = {
  id: string;
  thumbnail: string;
  title: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
};

export const getPosts = async (filter: string, cursor?: string, take = 20) => {
  try {
    switch (filter) {
      case "Latest": {
        const posts = await prisma.post.findMany({
          take: take + 1,
          ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
          }),
          select: {
            id: true,
            thumbnail: true,
            title: true,
            createdAt: true,
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

      case "Trending": {
        const posts = await prisma.$queryRaw<PostWithUser[]>`
          SELECT
            p.id,
            p.thumbnail,
            p.title,
            p."createdAt",
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
          ${cursor ? Prisma.sql`AND p.id < ${cursor}` : Prisma.empty}
          GROUP BY p.id, u.id
          ORDER BY score DESC
          LIMIT ${take + 1}
          OFFSET ${cursor ? Number(cursor) : 0}
        `;

        const hasNextPage = posts.length > take;
        const data = hasNextPage ? posts.slice(0, -1) : posts;
        const nextCursor = hasNextPage
          ? String(Number(cursor ?? 0) + take)
          : null;

        return { data, nextCursor };
      }

      default:
        return { data: null, nextCursor: null };
    }
  } catch (error) {
    console.error(error);
    return { data: null, nextCursor: null };
  }
};

export type Posts = Awaited<ReturnType<typeof getPosts>>;

export const getSearchedPosts = async (
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
            hasEvery: selectedTags,
          },
        }),
        ...(keyword.trim() && {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        }),
        ...(selectedMediums.length > 0 && {
          mediums: {
            hasEvery: selectedMediums,
          },
        }),
      },
      select: {
        id: true,
        thumbnail: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            email: true,
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
};

export type SearchedPosts = Awaited<ReturnType<typeof getSearchedPosts>>;


export const fetchPostsProfile = async (userId: string) => {
  return await prisma.post.findMany({
    where: {
      user: {
        id: userId,
      },
    },
    select: {
      id: true,
      thumbnail: true,
      title: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, username: true, image: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export type PostsProfile = Awaited<ReturnType<typeof fetchPostsProfile>>;

export const getPostComments = cache(async (postId: string) => {
  try {
    const postComments = await prisma.comment.findMany({
      where: {
        artPostId: postId,
      },
      select: {
        id: true,
        artPostId: true,
        ownerId: true,
        content: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      success: true,
      data: postComments,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
    };
  }
});

export type PostComments = Awaited<ReturnType<typeof getPostComments>>;

export const toggleLike = async (
  artPostId: string,
  ownerId: string,
  isLiked: boolean,
) => {
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

export const toggleSave = async (
  artPostId: string,
  ownerId: string,
  isSaved: boolean,
) => {
  if (isSaved) {
    await prisma.save.delete({
      where: {
        userId_postId: {
          userId: ownerId,
          postId: artPostId,
        },
      },
    });
  } else {
    await prisma.save.create({
      data: {
        userId: ownerId,
        postId: artPostId,
      },
    });
  }
};
