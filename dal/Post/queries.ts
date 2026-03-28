import { prisma } from "@/src/lib/prisma";
import { getUserSession } from "@/src/dal/getUserSession";
import { cache } from "react";

export const getPostDetails = cache(async (postId: string) => {
  try {
    const session = await getUserSession();
    const userId = session.user.id;
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
        id: true,
        mediums: true,
        tags: true,
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
