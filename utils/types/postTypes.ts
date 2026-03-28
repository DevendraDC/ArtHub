import { PostMedium } from "../../lib/generated/prisma/enums";

export type PostInfo = {
  title: string;
  description: string | null;
  mediums: PostMedium[];
  tags: string[];
  id: string;
  createdAt: Date;
  likes: {
    ownerId: string;
  }[];
  user: {
    image: string | null;
    id: string;
    name: string;
    bio: string;
    username: string | null;
    followers: {
      followerId: string;
    }[];
    _count: {
      artPosts: number;
      followers: number;
      following: number;
    };
  };
  _count: {
    comments: number;
    likes: number;
    usersSaved: number;
  };
} | null;
