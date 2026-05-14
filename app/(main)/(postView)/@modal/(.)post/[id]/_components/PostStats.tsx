"use client";

import OptimisticLike from "@/components/User/OptimisticLike";
import { getPostDetails } from "@/data/dal/Post/queriesActions";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Heart, MessageSquare } from "lucide-react";

export default function PostStats({ userId, postId }: { userId: string, postId: string }) {
    const { isPending, data } = useQuery({
        queryKey: ['postStats', postId, userId],
        queryFn: () => getPostDetails(postId, userId)
    })
    const isLiked = !!data?.data?.post?.likes.length;
    const likes = data?.data?.post?._count.likes;
    const comments = data?.data?.post?._count.comments;
    const collections = data?.data?.post?._count.Collections;
    return (
        <>
            <div className="border border-white/20"></div>
            <div className="flex gap-10 text-(--text-light)">
                {isPending ? (
                    <div className="flex gap-2 hover:bg-white/10 cursor-pointer w-fit p-2 rounded-lg transition-colors">
                        <Heart
                            size={22}
                            className="transition-colors stroke-current"
                        />
                        <div className="text-white/45">0</div>
                    </div>
                ) : (
                    <OptimisticLike data={{
                        isLiked,
                        likes: likes ?? 0,
                        postId,
                        userId
                    }} />
                )}

                <div className="flex gap-2 w-fit p-2">
                    <MessageSquare size={22} />
                    <div className="text-white/45">{isPending ? "0" : comments}</div>
                </div>
                <div className="flex gap-2 w-fit p-2">
                    <Bookmark size={22} />
                    <div className="text-white/45">{isPending ? "0" : collections}</div>
                </div>
            </div >
            <div className="border border-white/20"></div>
        </>
    )
}