import { prisma } from "@/src/lib/prisma";
import { getUserSession } from "../getUserSession";

export const getProfileSettingsData = async (userId: string) => {
  try {
    const data = await prisma.profile.findUnique({
      where: {
        profileId: userId,
      },
      select: {
        bio: true,
        location: true,
        portfolio: true,
      },
    });
    return {
        success: true,
        data: data
    }
  } catch (error) {
    console.error(error);
    return {
        success: false
    }
  }
};

export type ProfileSettingsData = Awaited<ReturnType<typeof getProfileSettingsData>>

export const getUserData2 = async () => {
  try {
    const session = await getUserSession();
    const data = await prisma.profile.findUnique({
      where: {
        profileId: session.userId,
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




