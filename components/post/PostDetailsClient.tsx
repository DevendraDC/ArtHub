"use client"

import { PostDetails, toggleLike } from "@/src/dal/posts";
import { mediumLabels } from "@/src/utils/postUtils";
import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { useEffect, useTransition } from "react";
import { motion } from "motion/react"
import { useLikeStore } from "@/src/store/useLikeStore";
import Image from "next/image";

export default function PostDetailsClient({ postDetails, sessionUserId }: { postDetails: PostDetails, sessionUserId: string }) {
    const [isPending, startTransition] = useTransition();
    const { likes, setLike, toggleLike: toggleLikeStore } = useLikeStore();
    const userDetails = [
        {
            value: postDetails?.user._count.artPosts,
            label: "Posts"
        },
        {
            value: postDetails?.user._count.followers,
            label: "Followers"
        },
        {
            value: postDetails?.user._count.following,
            label: "Followings"
        }
    ]

    useEffect(() => {
        if (!postDetails?.id) return;
        if (likes[postDetails.id]) return;
        setLike(postDetails.id, {
            likeCount: postDetails._count.likes ?? 0,
            isLiked: (postDetails.likes.length ?? 0) > 0,
        });
    }, [postDetails?.id]);

    const likeState = postDetails?.id ? likes[postDetails.id] : null;
    const isLiked = likeState?.isLiked ?? false;
    const likeCount = likeState?.likeCount ?? postDetails?._count.likes ?? 0;

    function handleLikeToggle() {
        if (!postDetails?.id) return;
        const currentIsLiked = isLiked;

        toggleLikeStore(postDetails.id);

        startTransition(async () => {
            try {
                await toggleLike(postDetails.id!, currentIsLiked, sessionUserId);
            } catch {
                toggleLikeStore(postDetails.id);
            }
        });
    }

    return (
        <motion.div className="w-full flex flex-col gap-12 bg-(--surface) p-7 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                    <div>
                        {postDetails?.user.image && <Image src={postDetails.user.image} alt="" width={60} height={60} className="rounded-full" />}
                    </div>
                    <div>
                        <div className="font-serif">
                            {postDetails?.user.name}
                        </div>
                        <div className="text-sm text-(--text-subtle)">
                            {postDetails?.user.username}
                        </div>
                    </div>
                </div>
                {postDetails?.user.bio && <div className="text-(--text-muted) font-sans text-sm">
                    {postDetails?.user.bio}
                </div>}

                <div className="flex bg-(--surface2)">
                    {
                        userDetails.map((det, i) => (
                            <div key={i} className={`flex flex-col justify-center p-1 items-center w-1/3 ${i === 1 && "border-l border-r border-border"}`}>
                                <div className="text-lg">{det.value}</div>
                                <div className="text-sm font-serif text-(--text-light)">{det.label}</div>
                            </div>
                        ))
                    }
                </div>
                {postDetails?.user.followers.length ? <button>Following</button> : <button className="bg-(--amber) p-2 text-black font-semibold font-sans rounded-lg hover:-translate-y-1 transition-all duration-300">Follow</button>}
            </div>
            <div className="userDetails bg-(--surface) w-full flex flex-col gap-5 self-start">
                <div className="text-xl font-serif">
                    {postDetails?.title}
                </div>
                {postDetails?.description && <div className="text-(--text-muted) font-sans break-words min-w-0">
                    {postDetails?.description}
                </div>}
                <div className="border border-border"></div>
                <div className="flex gap-10 text-(--text-light)">
                    <button
                        onClick={handleLikeToggle}
                        disabled={isPending}
                        className="flex gap-2 hover:bg-(--surface2) cursor-pointer w-fit p-2 rounded-lg transition-colors"
                    >
                        <Heart
                            size={22}
                            className={`transition-colors ${isLiked ? "fill-amber-400 stroke-amber-400" : "stroke-current"}`}
                        />
                        <div className="text-(--text-muted)">{likeCount}</div>
                    </button>
                    <div className="flex gap-2 w-fit p-2">
                        <MessageSquare size={22} />
                        <div className="text-(--text-muted)">{postDetails?._count.comments}</div>
                    </div>
                    <div className="flex gap-2 w-fit p-2">
                        <Bookmark size={22} />
                        <div className="text-(--text-muted)">{postDetails?._count.usersSaved}</div>
                    </div>
                </div>
            </div>
            <div className="Mediums flex flex-col gap-3">
                <div className="text-sm font-sans tracking-widest text-(--text-light)">
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
            <div className="tags flex flex-col gap-3">
                <div className="text-sm font-sans tracking-widest text-(--text-light)">
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