"use server";

import { PostMedium } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

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

export async function getPosts() {
  try {
    const posts = await prisma.artPost.findMany({
      include: {
        comments: true,
        user: {
            select : {
                userId : true,
                
            }
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
  }
}
