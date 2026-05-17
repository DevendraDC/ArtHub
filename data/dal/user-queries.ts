"use server";

import { prisma } from "@/lib/prisma";
import { cache } from "react";
import { fetchPostsProfile } from "./Post/queriesActions";

export const getUser = async (username: string, userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
      NOT: {
        id: userId,
      },
    },
  });

  return user;
};




