"use client"

import { toggleFollow } from "@/src/data/dal/user-queries";
import { useOptimistic, useState, useTransition } from "react";

type data = {
    isFollowing: boolean;
    followers: number | undefined;
    postOwnerId: string;
    userId: string;
}

export default function OptimisticFollow({ data }: {data: data}) {
    const {followers, isFollowing, postOwnerId, userId} = data;
    const [isPending, startTransition] = useTransition();
    const [baseFollowState, setBaseFollowState] = useState({
        isFollowing, followers : followers ?? 0
    })
    const [optimisticFollowState, updateOptimisticFollow] = useOptimistic(
        baseFollowState,
        (current, isFollowing: boolean) => ({
            isFollowing,
            followers: current.followers + (isFollowing ? +1 : -1)
        })
    )
    const handleFollow = () => {
        const newFollowState = !optimisticFollowState.isFollowing;
        startTransition(async () => {
            updateOptimisticFollow(newFollowState);
            try {
                await toggleFollow(userId, postOwnerId)
                setBaseFollowState((prev) => ({
                    isFollowing: newFollowState,
                    followers:
                        prev.followers + (newFollowState ? 1 : -1),
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