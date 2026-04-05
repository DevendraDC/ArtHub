"use client"

import { Bookmark, MessageSquare } from "lucide-react";
import { motion } from "motion/react"
import OptimisticFollow from "@/src/components/User/OptimisticFollow";
import OptimisticLike from "@/src/components/User/OptimisticLike";
import { PostDetails } from "@/src/data/dal/Post/queries";

export default function PostDetailsClient({ post }: { post: PostDetails }) {
    if (!post || !post.postInfo || !post.sessionUserId) return null;
    const { sessionUserId, postInfo } = post;
    const date = new Date(postInfo?.createdAt ?? Date.now());
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return (
        <motion.div
            className="w-full flex flex-col gap-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>

            <div className="w-full mb-3">
                <OptimisticFollow data={{
                    isFollowing: !!postInfo.user.followers.length,
                    postOwnerId: sessionUserId,
                    userId: postInfo.user.id
                }} />
            </div>

            <div className="postDetails w-full flex flex-col gap-2 self-start">
                <div className="text-xl font-serif">
                    {postInfo?.title}
                </div>
                {postInfo?.description && <div className="text-(--text-muted) font-sans wrap-break-word min-w-0">
                    {postInfo?.description}
                </div>}
                <div className="text-sm text-white/30 flex gap-2 items-center">
                    {time}
                    <span className="text-xl text-white/50">&middot;</span>
                    {dateStr}
                </div>
                <div className="border border-white/20"></div>
                <div className="flex gap-10 text-(--text-light)">
                    <OptimisticLike data={{
                        isLiked: !!postInfo.likes.length,
                        likes: postInfo._count.likes,
                        postId: postInfo.id,
                        userId: sessionUserId
                    }} />
                    <div className="flex gap-2 w-fit p-2">
                        <MessageSquare size={22} />
                        <div className="text-white/45">{postInfo?._count.comments}</div>
                    </div>
                    <div className="flex gap-2 w-fit p-2">
                        <Bookmark size={22} />
                        <div className="text-white/45">{postInfo?._count.Collections}</div>
                    </div>
                </div>
                <div className="border border-white/20"></div>
            </div>
        </motion.div>
    )
}