"use server";

import { PostMedium } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "../getUserSession";
import { createPostSchemaServer } from "@/validators/post";
import z from "zod";

export async function postUpload(formData: FormData) {
  try {
    const session = await getUserSession();
    if (!session || !session.user.id) throw new Error("session not found");
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

    await prisma.post.create({
      data: {
        authorId,
        title,
        thumbnail: artImages[0],
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
