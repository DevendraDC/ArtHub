"use server";

import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";
import { cache } from "react";

export async function postUpload(formData: FormData) {
  try {
    const authorId = formData.get("authorId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.getAll("tags") as string[];
    const artImages = formData.getAll("images") as string[];
    const medium = formData.getAll("mediums") as PostMedium[];

    if (!authorId || !title || medium.length === 0 || artImages.length === 0) {
      throw new Error("please fill the required fields");
    }
    await prisma.artPost.create({
      data: {
        authorId,
        title,
        description,
        medium,
        tags,
        artImages: {
          create: artImages.map((url, i) => ({
            url,
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

// export const getPosts = cache(async () => {
//   try {
//     const posts = await prisma.artPost.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true,
//           },
//         },
//         _count: {
//           select: {
//             likes: true,
//             comments: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     return posts;
//   } catch (error) {
//     console.error(error);
//   }
// });

// export type Posts = Awaited<ReturnType<typeof getPosts>>;

// export const getPosts = cache(async (userId: string) => {
//   try {
//     const posts = await prisma.artPost.findMany({
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true,
//             bio: true,
//             _count: {
//               select: {
//                 followers: true,
//                 following: true,
//                 artPosts: true,
//               },
//             },
//           },
//         },
//         _count: {
//           select: {
//             comments: true,
//             likes: true,
//           },
//         },
//         likes: {
//           where: {
//             ownerId: userId,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     return posts;
//   } catch (error) {
//     console.error(error);
//   }
// });

// export type Posts = Awaited<ReturnType<typeof getPosts>>;
// export type Post = NonNullable<Posts>[number];

export const getPosts = cache(async () => {
  try {
    const posts = await prisma.artPost.findMany({
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
    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
});

export type Posts = Awaited<ReturnType<typeof getPosts>>;

export const getPost = cache(async (postId: string, userId: string) => {
  try {
    const post = await prisma.artPost.findUnique({
      where: {
        id: postId,
      },
      include: {
        artImages: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                following: true,
                artPosts: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
        likes: {
          where: {
            ownerId: userId,
          },
        },
        comments: true,
      },
    });
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
});

export type Post = Awaited<ReturnType<typeof getPost>>;

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

export const getPostOwnerDetails = cache(
  async (postId: string, userId: string) => {
    try {
      const postOwnerDetails = prisma.artPost.findUnique({
        where: {
          id: postId,
        },
        select: {
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
              // _count: {
              //   select: {
              //     followers: true,
              //     following: true,
              //     artPosts: true,
              //   },
              // },
            },
          },
        },
      });
      return postOwnerDetails;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
);

export type PostOwnerDetails = Awaited<ReturnType<typeof getPostOwnerDetails>>;

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
        // user: {
        //   select: {
        //     id: true,
        //     name: true,
        //     username: true,
        //     image: true,
        //     bio: true,
        //     followers: {
        //       where: {
        //         followerId: userId,
        //       },
        //     },
        //     _count: {
        //       select: {
        //         followers: true,
        //         following: true,
        //         artPosts: true,
        //       },
        //     },
        //   },
        // },
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

export const toggleLike = async (
  postId: string,
  isLiked: boolean,
  sessionUserId: string,
) => {
  if (isLiked) {
        await prisma.like.deleteMany({
            where: { artPostId: postId, ownerId: sessionUserId }
        });
    } else {
        await prisma.like.upsert({
            where: { artPostId_ownerId: { artPostId: postId, ownerId: sessionUserId } },
            create: { artPostId: postId, ownerId: sessionUserId },
            update: {}
        });
    }
};
