import { z } from "zod";

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
      .min(6, "Name must be atleast 6 characters long")
      .max(12, "Name cannot be more than 12 characters long"),
    bio: z
      .string()
      .max(300, "Bio should not be more than 300 characters")
      .optional(),
    username: z
      .string()
      .min(5, "Username must be at least 5 characters")
      .max(10, "Username cannot be more than 10 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers, and underscores allowed",
      )
      .transform((val) => val.toLowerCase()),
    portfolio: z.string().url().optional().or(z.literal("")),
    location: z.string(),
  })
