"use client"

import { toggleFollow } from "@/data/dal/User/mutations";
import { useOptimistic, useTransition } from "react";

type data = {
    isFollowing: boolean;
    postOwnerId: string;
    userId: string;
}

export default function OptimisticFollow({ data }: { data: data }) {
    const { isFollowing, postOwnerId, userId } = data;
    const [isPending, startTransition] = useTransition();
    const [optimisticFollowState, updateOptimisticFollow] = useOptimistic(
        isFollowing,
        (current, isFollowing: boolean) => (
            isFollowing
        )
    )
    const handleFollow = () => {
        const newFollowState = !optimisticFollowState;
        startTransition(async () => {
            updateOptimisticFollow(newFollowState);
            await toggleFollow(userId, postOwnerId, !newFollowState)
        })
    }

    return (
        <button disabled={isPending} onClick={handleFollow} className={`p-2 w-full font-sans text-sm rounded-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 ${optimisticFollowState ? "text-blue-400/45 bg-transparent border-2 border-blue-400/45" : "bg-blue-200/15 text-blue-400 text-black"}`} >
            {optimisticFollowState ? "Following" : "Follow"}
        </button>
    )
}