import z from "zod";
import { PostMedium } from "../lib/generated/prisma/enums";

export const createPostSchemaClient = z.object({
  title: z.string().min(1, "Title is required"),
  images: z
    .array(z.instanceof(File))
    .min(1, "At least 1 image is required")
    .max(10, "Cannot have more than 10 images")
    .refine((files) => files.every((f) => f.type.startsWith("image/")), {
      message: "Only images are allowed",
    }),
  mediums: z.array(z.enum(PostMedium)).min(1, "Select at least 1 medium"),
  description: z.string().max(500, "description cannot be more than 500 words"),
});

export type ZodTreeError = ReturnType<typeof z.treeifyError>;

export const createPostSchemaServer = z.object({
  title: z.string().min(1, "Title is required"),
  images: z.array(z.string()).min(1, "At least 1 image is required"),
  mediums: z.array(z.enum(PostMedium)).min(1, "Select at least 1 medium"),
  description: z.string().max(500, "description cannot be more than 500 words"),
});
