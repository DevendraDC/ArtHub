"use client"

import { toggleFollow } from "@/src/data/dal/user-queries";
import { useOptimistic, useState, useTransition } from "react";

type data = {
    isFollowing: boolean;
    postOwnerId: string;
    userId: string;
}

export default function OptimisticFollow({ data }: {data: data}) {
    const {isFollowing, postOwnerId, userId} = data;
    const [isPending, startTransition] = useTransition();
    const [baseFollowState, setBaseFollowState] = useState({
        isFollowing
    })
    const [optimisticFollowState, updateOptimisticFollow] = useOptimistic(
        baseFollowState,
        (current, isFollowing: boolean) => ({
            isFollowing
        })
    )
    const handleFollow = () => {
        const newFollowState = !optimisticFollowState.isFollowing;
        startTransition(async () => {
            updateOptimisticFollow(newFollowState);
            try {
                await toggleFollow(userId, postOwnerId)
                setBaseFollowState(() => ({
                    isFollowing: newFollowState
                }));
            } catch (error) {
                updateOptimisticFollow(!newFollowState)
            }
        })
    }

    return (
        <button disabled={isPending} onClick={handleFollow} className={`p-2 w-full font-sans rounded-lg hover:-translate-y-1 transition-all duration-300 ${optimisticFollowState.isFollowing ? "text-white/45 bg-transparent border border-white/45" : "bg-(--bl2) font-semibold text-black"}`} >
            {optimisticFollowState.isFollowing ? "Following" : "Follow"}
        </button>
    )
}