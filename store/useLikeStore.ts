import { create } from "zustand";

type LikeEntry = {
  likeCount: number;
  isLiked: boolean;
};

type LikeStore = {
  likes: Record<string, LikeEntry>;
  setLike: (postId: string, entry: LikeEntry) => void;
  toggleLike: (postId: string) => void;
};

export const useLikeStore = create<LikeStore>((set) => ({
  likes: {},
  setLike: (postId, entry) =>
    set((state) => ({ likes: { ...state.likes, [postId]: entry } })),
  toggleLike: (postId) =>
    set((state) => {
      const current = state.likes[postId];
      if (!current) return state;
      return {
        likes: {
          ...state.likes,
          [postId]: {
            isLiked: !current.isLiked,
            likeCount: current.isLiked
              ? current.likeCount - 1
              : current.likeCount + 1,
          },
        },
      };
    }),
}));
