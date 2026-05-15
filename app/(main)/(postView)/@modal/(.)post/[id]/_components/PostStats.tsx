"use client";

import OptimisticLike from "@/components/User/OptimisticLike";
import { getPostStats } from "@/data/dal/Post/queriesActions";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PostStats({ postId }: { postId: string }) {
    const router = useRouter();
    const { isPending, data } = useQuery({
        queryKey: ['postStats', postId],
        queryFn: () => getPostStats(postId)
    })
    const userId = data?.data?.userId;
    const isLiked = !!data?.data?.post?.likes.length;
    const comments = data?.data?.post?._count.comments;
    const likes = data?.data?.post?._count.likes;
    const collections = data?.data?.post?._count.Collections;
    return (
        <>
            <div className="border border-white/20"></div>
            <div className="flex gap-10 text-(--text-light)">
                {userId ? (
                    <OptimisticLike data={{
                        isLiked,
                        likes: likes ?? 0,
                        postId,
                        userId
                    }} />

                ) : (
                    <div className="flex gap-2 hover:bg-white/10 cursor-pointer w-fit p-2 rounded-lg transition-colors">
                        <Heart
                            size={22}
                            className="transition-colors stroke-current"
                            onClick={() => router.push("/login")}
                        />
                        <div className="text-white/45">{likes}</div>
                    </div>
                )}

                <div className="flex gap-2 w-fit p-2">
                    <MessageSquare size={22} />
                    <div className="text-white/45">{comments}</div>
                </div>
                <div className="flex gap-2 w-fit p-2">
                    <Bookmark size={22} />
                    <div className="text-white/45">{collections}</div>
                </div>
            </div >
            <div className="border border-white/20"></div>
        </>
    )
}
