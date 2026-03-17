"use client"

import { PostDetails, toggleLike } from "@/src/dal/posts";
import { mediumLabels } from "@/src/utils/postUtils";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { motion } from "motion/react"

type LikeState = {
    likeCount: number;
    isLiked: boolean;
}

export default function PostDetailsClient({ postDetails, sessionUserId }: { postDetails: PostDetails, sessionUserId: string }) {
    const [isPending, startTransition] = useTransition()

    const [optimisticLike, setOptimisticLike] = useOptimistic<LikeState, void>(
        {
            likeCount: postDetails?._count.likes ?? 0,
            isLiked: (postDetails?.likes.length ?? 0) > 0,
        },
        (state) => ({
            likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
            isLiked: !state.isLiked,
        })
    );

    function handleLikeToggle() {
        if (!postDetails?.id) return;
        const currentIsLiked = optimisticLike.isLiked;
        startTransition(async () => {
            setOptimisticLike();
            await toggleLike(postDetails.id!, currentIsLiked, sessionUserId);
        });
    }
    return (
        <motion.div className="w-full flex flex-col gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="userDetails bg-(--surface) w-full p-7 flex flex-col gap-5 self-start rounded-lg border border-border">
                <div className="text-xl font-serif">
                    {postDetails?.title}
                </div>
                <div className="text-(--text-muted) font-sans break-words min-w-0">
                    {postDetails?.description}
                </div>
                <div className="border border-border"></div>
                <div className="flex gap-10">
                    <button
                        onClick={handleLikeToggle}
                        disabled={isPending}
                        className="flex gap-2 hover:bg-(--surface2) cursor-pointer w-fit p-2 rounded-lg transition-colors disabled:opacity-60"
                    >
                        <Heart
                            size={22}
                            className={`transition-colors ${optimisticLike.isLiked ? "fill-amber-400 stroke-amber-400" : "stroke-current"}`}
                        />
                        <div className="text-(--text-subtle)">{optimisticLike.likeCount}</div>
                    </button>
                    <div className="flex gap-2 w-fit p-2">
                        <MessageSquare size={22} />
                        <div className="text-(--text-subtle)">{postDetails?._count.comments}</div>
                    </div>
                    <div className="flex gap-2 w-fit p-2">
                        <Bookmark size={22} />
                        <div className="text-(--text-subtle)">{postDetails?._count.usersSaved}</div>
                    </div>
                </div>
            </div>
            <div className="Mediums box flex flex-col gap-2 p-4">
                <div className="text-sm font-sans tracking-widest text-(--text-muted)">
                    <span className="text-amber-400">&middot; </span>MEDIUMS
                </div>
                <div className="flex flex-wrap gap-3">
                    {postDetails?.medium.map((med, i) => (
                        <div key={i} className="p-2 rounded-lg border border-border text-(--text-muted) text-xs">
                            {mediumLabels[med]}
                        </div>
                    ))}
                </div>
            </div>
            <div className="tags box flex flex-col gap-2 p-4">
                <div className="text-sm font-sans tracking-widest text-(--text-muted)">
                    <span className="text-amber-400">&middot; </span>TAGS
                </div>
                <div className="flex flex-wrap gap-3">
                    {postDetails?.tags.map((tag, i) => (
                        <div key={i} className="p-2 rounded-lg border border-border text-(--text-muted) text-xs">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}