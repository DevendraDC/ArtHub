"use server";

import { PostMedium } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";

export type PostWithUser = {
  id: string;
  thumbnail: string;
  title: string;
  description: string | null;
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


export const getPosts =
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
              title: true,
              description: true,
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
            p.title,
            p.description,
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
  }

export type Posts = Awaited<ReturnType<typeof getPosts>>;

export const getSearchedPosts = async (
  selectedTags: string[],
  selectedMediums: PostMedium[],
  sortBy: string,
  keyword: string,
) => {
  "use server";
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
        description: true,
        createdAt: true,
        mediums: true,
        tags: true,
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



export const getPostDetails = async (postId: string, userId: string) => {
  try {
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
        // user: {
        //   select: {
        //     id: true,
        //     followers: {
        //       where: {
        //         followerId: userId,
        //       },
        //       select: {
        //         followerId: true,
        //       },
        //     },
        //   },
        // },
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
      success: true,
      data: {
        post: postDetails,
        userId: userId,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}

export type PostDetails = Awaited<ReturnType<typeof getPostDetails>>;
