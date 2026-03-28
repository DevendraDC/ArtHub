"use client"

import { toggleLike } from "@/src/dal/posts";
import { PostDetails } from "@/src/dal/Post/queries";
import { mediumLabels } from "@/src/utils/postUtils";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { motion } from "motion/react"
import Image from "next/image";
import { toggleFollow } from "@/src/dal/user-queries";
import { PostInfo } from "@/src/utils/types/postTypes";

export default function PostDetailsClient({ postInfo, sessionUserId }: { postInfo: PostInfo, sessionUserId: string }) {
    const [isPending, startTransition] = useTransition();
    const date = new Date(postInfo?.createdAt ?? Date.now());
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const [baseLikeState, setBaseLikeState] = useState({
        isLiked: !!postInfo?.likes.length, likesCount: postInfo?._count.likes ?? 0
    })
    const [baseFollowState, setBaseFollowState] = useState({
        isFollowing: !!postInfo?.user.followers.length, followerCount: postInfo?.user._count.followers ?? 0
    })
    const [optimisticFollowState, updateOptimisticFollow] = useOptimistic(
        baseFollowState,
        (current, isFollowing: boolean) => ({
            isFollowing,
            followerCount: current.followerCount + (isFollowing ? +1 : -1)
        })
    )
    const [optimisticLikeState, updateOptimisticLike] = useOptimistic(
        baseLikeState,
        (current, isLiked: boolean) => ({
            isLiked,
            likesCount: current.likesCount + (isLiked ? +1 : -1)
        })
    )
    const handleLikeToggle = () => {
        if (!postInfo?.id) return;
        const newLikedState = !optimisticLikeState.isLiked;
        startTransition(async () => {
            updateOptimisticLike(newLikedState);
            try {
                await toggleLike(postInfo?.id, postInfo?.user.id);
                setBaseLikeState((prev) => ({
                    isLiked: newLikedState,
                    likesCount:
                        prev.likesCount + (newLikedState ? 1 : -1),
                }));
            } catch (error) {
                updateOptimisticFollow(!newLikedState)
            }
        })
    }
    const handleClick = () => {
        if (!postInfo?.user.id) return;
        const newFollowState = !optimisticFollowState.isFollowing;
        startTransition(async () => {
            updateOptimisticFollow(newFollowState);
            try {
                await toggleFollow(sessionUserId, sessionUserId)
                setBaseFollowState((prev) => ({
                    isFollowing: newFollowState,
                    followerCount:
                        prev.followerCount + (newFollowState ? 1 : -1),
                }));
            } catch (error) {
                updateOptimisticFollow(!newFollowState)
            }
        })
    }
    const userDetails = [
        {
            value: postInfo?.user._count.artPosts,
            label: "Posts"
        },
        {
            value: optimisticFollowState.followerCount,
            label: "Followers"
        },
        {
            value: postInfo?.user._count.following,
            label: "Followings"
        }
    ]


    return (
        <motion.div className="w-full min-h-full flex flex-col gap-8 bg-black p-5 rounded-r-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                    <div>
                        {postInfo?.user.image && <Image src={postInfo.user.image} alt="" width={60} height={60} className="rounded-full" />}
                    </div>
                    <div>
                        <div className="font-serif">
                            {postInfo?.user.name}
                        </div>
                        <div className="text-sm text-(--text-subtle)">
                            {postInfo?.user.username}
                        </div>
                    </div>
                </div>
                {postInfo?.user.bio && <div className="text-(--text-muted) font-sans text-sm">
                    {postInfo?.user.bio}
                </div>}

                <div className="flex bg-(--surface2) rounded-lg">
                    {
                        userDetails.map((det, i) => (
                            <div key={i} className={`flex flex-col justify-center p-1 items-center w-1/3 ${i === 1 && "border-l border-r border-border"}`}>
                                <div className="text-lg">{det.value}</div>
                                <div className="text-sm font-serif text-(--text-light)">{det.label}</div>
                            </div>
                        ))
                    }
                </div>
                <button disabled={isPending} onClick={handleClick} className={`p-2 font-semibold font-sans rounded-lg hover:-translate-y-1 transition-all duration-300 ${optimisticFollowState.isFollowing ? "text-(--text-muted) bg-transparent border-2 border-(--text-muted)" : "bg-(--amber) text-black"}`} >
                    {optimisticFollowState.isFollowing ? "Following" : "Follow"}
                </button>
            </div>
            <div className="postDetails bg-(--surface) w-full flex flex-col gap-2 self-start">
                <div className="text-xl font-serif">
                    {postInfo?.title}
                </div>
                {postInfo?.description && <div className="text-(--text-muted) font-sans wrap-break-word min-w-0">
                    {postInfo?.description}
                </div>}
                <div className="text-sm text-(--text-subtle) flex gap-2 items-center">
                    {time}
                    <span className="text-xl text-(--text-muted)">&middot;</span>
                    {dateStr}
                </div>
                <div className="border border-(--text-muted)/30"></div>
                <div className="flex gap-10 text-(--text-light)">
                    <button
                        onClick={handleLikeToggle}
                        disabled={isPending}
                        className="flex gap-2 hover:bg-(--surface2) cursor-pointer w-fit p-2 rounded-lg transition-colors"
                    >
                        <Heart
                            size={22}
                            className={`transition-colors ${optimisticLikeState.isLiked ? "fill-amber-400 stroke-amber-400" : "stroke-current"}`}
                        />
                        <div className="text-(--text-muted)">{optimisticLikeState.likesCount}</div>
                    </button>
                    <div className="flex gap-2 w-fit p-2">
                        <MessageSquare size={22} />
                        <div className="text-(--text-muted)">{postInfo?._count.comments}</div>
                    </div>
                    <div className="flex gap-2 w-fit p-2">
                        <Bookmark size={22} />
                        <div className="text-(--text-muted)">{postInfo?._count.usersSaved}</div>
                    </div>
                </div>
                <div className="border border-(--text-muted)/30"></div>
            </div>
            <div className="Mediums flex flex-col gap-3">
                <div className="text-sm font-sans tracking-widest text-(--text-light)">
                    MEDIUMS
                </div>
                <div className="flex flex-wrap gap-3">
                    {postInfo?.mediums.map((med, i) => (
                        <div key={i} className="p-2 rounded-lg border border-border text-(--text-muted) text-xs">
                            {mediumLabels[med]}
                        </div>
                    ))}
                </div>
            </div>
            <div className="tags flex flex-col gap-3">
                <div className="text-sm font-sans tracking-widest text-(--text-light)">
                    TAGS
                </div>
                <div className="flex flex-wrap gap-3">
                    {postInfo?.tags.map((tag, i) => (
                        <div key={i} className="p-2 rounded-lg border border-border text-(--text-muted) text-xs">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}