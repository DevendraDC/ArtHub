"use server";

import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";

export async function postUpload(formData: FormData) {
  try {
    const data = {
      authorId: formData.get("authorId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      tags: formData.getAll("tags") as string[],
      artImages: formData.getAll("images") as string[],
      medium: formData.getAll("mediums") as string[] as PostMedium[],
    };
    if (
      !data.authorId ||
      !data.title ||
      data.medium.length === 0 ||
      data.artImages.length === 0
    ) {
      throw new Error("please fill the required fields");
    }
    await prisma.artPost.create({
      data,
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

export async function getPosts(userId : string) {
  try {
    const posts = await prisma.artPost.findMany({
      include: {
        comments: true,
        user: {
            select : {
                id : true,
                name : true,
                username : true,
                image : true
            }
        },
        _count: {
          select: {
            likes: true,
            comments : true
          },
        },
        likes : {
          where : {
            ownerId : userId
          }
        }
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}

export type Posts = Awaited<ReturnType<typeof getPosts>>;
