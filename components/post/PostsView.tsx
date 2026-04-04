"use client";

import Image from "next/image";
import { postTime } from "@/src/utils/postUtils";
import { Posts, PostWithUser } from "@/src/data/dal/Post/queries";
import Link from "next/link";
import { cloudinaryTransform } from "@/src/utils/cloudinaryTransform";
import { motion } from "motion/react"
import { memo } from "react";
import { usePostStore } from "@/src/store/usePostStore";

const PostsView = memo(function PostsView({ posts }: { posts: PostWithUser[] }) {
    const setPreview = usePostStore((s) => s.setPreview)
    return (
        <div>
            <div className="grid grid-cols-6 gap-4">
                {posts.map((post) => {
                    const url = post.thumbnail;
                    const previewUrl = cloudinaryTransform(url, "f_auto,q_auto,w_370,c_limit")
                    const previewData = {
                        id: post.id,
                        thumbnail: post.thumbnail,
                        tags: post.tags,
                        mediums: post.mediums,
                        user: {
                            id: post.id,
                            name: post.user.name,
                            image: post.user.image ?? "",
                            username: post.user.username ?? ""
                        }
                    }
                    return (
                        <Link href={`/post/${post.id}`} key={post.id} onClick={() => setPreview(previewData)}>
                            <motion.div
                                key={post.id}
                                className="w-55 h-55 aspect-square relative bg-transparent rounded-lg group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <Image
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    loading="eager"
                                    src={previewUrl}
                                    alt=""
                                    fill
                                    className="object-cover rounded-lg"
                                />
                                <div
                                    className="p-2 flex flex-col gap-3 absolute bottom-0 justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-0 z-9 bg-black mask-t-from-1% to-transparent"
                                >
                                    <div className="flex text-xs justify-between items-center">
                                        <div className="flex gap-3 items-center">
                                            {post.user.image && (
                                                <Image
                                                    src={post.user.image}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <div className="text-sm">{post.user.name}</div>
                                                <div className="text-xs text-blue-100/40">
                                                    {post.user.username}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-blue-100/40 text-xs">
                                            {postTime(post.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
})

export default PostsView;
