"use client"

import { toggleLike } from "@/data/dal/posts";
import { Heart } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";

type data = {
    isLiked : boolean;
    likes: number;
    userId: string;
    postId: string;
}

export default function OptimisticLike({ data }: { data: data}) {
    const {isLiked, likes, postId, userId} = data;
    const [isPending, startTransition] = useTransition();
    const [baseLikeState, setBaseLikeState] = useState({
        isLiked, likes
    })
    const [optimisticLikeState, updateOptimisticLike] = useOptimistic(
        baseLikeState,
        (current, isLiked: boolean) => ({
            isLiked,
            likes: current.likes + (isLiked ? +1 : -1)
        })
    )
    const handleLikeToggle = () => {
        // if (!postInfo?.id) return;
        const newLikedState = !optimisticLikeState.isLiked;
        startTransition(async () => {
            updateOptimisticLike(newLikedState);
            try {
                await toggleLike(postId, userId, isLiked);
                setBaseLikeState((prev) => ({
                    isLiked: newLikedState,
                    likes:
                        prev.likes + (newLikedState ? +1 : -1),
                }));
            } catch (error) {
                updateOptimisticLike(!newLikedState)
            }
        })
    }
    return (
        <button
            onClick={handleLikeToggle}
            disabled={isPending}
            className="flex gap-2 hover:bg-white/10 cursor-pointer w-fit p-2 rounded-lg transition-colors"
        >
            <Heart
                size={22}
                className={`transition-colors ${optimisticLikeState.isLiked ? "fill-(--bl2) stroke-(--bl2)" : "stroke-current"}`}
            />
            <div className="text-white/45">{optimisticLikeState.likes}</div>
        </button>
    )
}