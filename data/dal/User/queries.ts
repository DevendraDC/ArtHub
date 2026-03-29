import { prisma } from "@/src/lib/prisma";
import { getUserSession } from "../getUserSession";

export const getUserData2 = async () => {
  try {
    const session = await getUserSession();
    const data = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      select: {
        bio: true,
        _count: {
          select: {
            artPosts: true,
            followers: true,
            following: true,
            likes: true,
          },
        },
      },
    });
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
};
