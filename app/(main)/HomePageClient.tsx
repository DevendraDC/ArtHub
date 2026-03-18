"use client";

import Image from "next/image";
import { postTime } from "@/src/utils/postUtils";
import { Posts } from "@/src/dal/posts";
import Link from "next/link";
import { cloudinaryTransform } from "@/src/utils/image-transform";
import { motion } from "motion/react"

export default function HomePageClient({ posts }: { posts: Posts }) {
    return (
        <div>
            <div className="grid grid-cols-5 gap-4">
                {posts?.map((post) => {
                    const url = post.artImages[0].url;
                    const preview = cloudinaryTransform(url, "f_auto,q_auto,w_370,c_limit")
                    return (
                        <Link href={`/post/${post.id}`} key={post.id}>
                            <motion.div
                                key={post.id}
                                className="w-70 h-70 relative bg-(--surface2) overflow-hidden group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <Image
                                    loading="lazy"
                                    src={preview}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                                <div
                                    className="p-4 flex flex-col gap-3 absolute bottom-0 justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-0 backdrop-blur-2xl z-9 bg-(--bg) mask-t-from-10% to-transparent"
                                >
                                    <div className="flex text-xs justify-between items-center">
                                        <div className="flex gap-3 items-center">
                                            {post.user.image && (
                                                <Image
                                                    src={post.user.image}
                                                    alt=""
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <div className="text-sm">{post.user.name}</div>
                                                <div className="text-xs text-(--text-muted)">
                                                    {post.user.username}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-(--text-muted)">
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
}
