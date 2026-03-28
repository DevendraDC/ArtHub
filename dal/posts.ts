"use server";

import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";
import { cache } from "react";
import { getUserSession } from "../utils/getUserSession";


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
  } catch (error) {
    console.error(error);
    return null;
  }
});

export type FollowingPosts = Awaited<ReturnType<typeof getFollowingPosts>>;

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
        mediums: true,
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
