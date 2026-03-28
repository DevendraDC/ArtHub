"use server";

import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";
import { getUserSession } from "@/src/dal/getUserSession";
import { createPostSchemaServer } from "@/src/validators/post";
import z from "zod";

export async function postUpload(formData: FormData) {
  try {
    const session = await getUserSession();
    const authorId = session.user.id;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.getAll("tags") as string[];
    const artImages = formData.getAll("images") as string[];
    const mediums = formData.getAll("mediums") as PostMedium[];

    const validatedData = createPostSchemaServer.safeParse({
      title,
      images: artImages,
      mediums,
      description,
    });
    if (!validatedData.success) {
      return {
        isSuccess: false,
        formError: z.treeifyError(validatedData.error),
      };
    }

    await prisma.artPost.create({
      data: {
        authorId,
        title,
        description,
        mediums,
        tags,
        artImages: {
          create: artImages.map((img, i) => ({
            url: img,
            order: i,
          })),
        },
      },
    });
    return {
      isSuccess: true,
    };
  } catch (error) {
    console.error(error);
    return {
      isSuccess: false,
      error: error instanceof Error ? error.message : "Failed to publish post",
    };
  }
}
