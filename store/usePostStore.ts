import { create } from "zustand";
import { PostMedium } from "../lib/generated/prisma/enums";

type PostPreview = {
  id: string;
  thumbnail: string;
  title: string;
  description: string | null;
  tags: string[];
  mediums: PostMedium[];
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string;
    username: string;
  };
};

type PostStore = {
  preview: PostPreview | null;
  setPreview: (post: PostPreview) => void;
};

export const usePostStore = create<PostStore>((set) => ({
  preview: null,
  setPreview: (post) => set({ preview: post }),
}));
