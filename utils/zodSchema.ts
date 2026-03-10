import { getUser } from "@/dal/user-queries";
import { refine, z } from "zod";
import { prisma } from "@/lib/prisma";

enum getUserBy {
  ID,
  USERNAME,
  EMAIL,
}

export const authSchema = z.object({
  email: z.email("invalid email address"),
  password: z
    .string()
    .min(8, "password must be atleast 8 characters long")
    .max(15, "password cannot be more than 15 characters long"),
});

export const profileSchema = z
  .object({
    userId: z.string(),
    artistName: z
      .string()
      .min(6, "artist name must be atleast 6 characters long")
      .max(20, "artist name cannot be more than 20 characters long"),
    bio: z
      .string()
      .max(3000, "bio should not be more than 3000 characters")
      .optional(),
    username: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .max(20, "Too long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed",
      )
      .transform((val) => val.toLowerCase()),
  })
  .superRefine(async (data, ctx) => {
    const existingUser = await getUser(data.userId, data.username);

    if (existingUser) {
      ctx.addIssue({
        path: ["username"],
        code: "custom",
        message: "This username is already taken",
      });
    }
  });
