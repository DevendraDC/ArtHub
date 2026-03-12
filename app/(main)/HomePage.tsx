"use client"

import { Session } from "@/src/utils/getSession";
import { Posts } from "@/src/dal/posts";
import Image from "next/image";
import { Heart, MessageSquare } from "lucide-react";
import { useState } from "react";
import { mediumLabels, postTime } from "@/src/utils/postUtils";

interface props {
    userSession: Session,
    posts: Posts
}

export default function HomePage({ userSession, posts }: props) {
    const [hovered, setHovered] = useState("")
    return (
        <div className="bg-(--bg) flex justify-center">
            <div className="w-[80%] flex flex-wrap p-10 gap-5">
                {posts && (
                    posts.map(post => (
                        <div key={post.id} onMouseLeave={() => setHovered("")} onMouseEnter={() => setHovered(post.id)} className="w-70 h-70 relative bg-(--surface2) overflow-hidden">
                            <Image src={post.artImages[0]} alt="" fill className="object-cover" />
                            <div className={`p-4 flex flex-col gap-3 absolute bottom-0 opacity-0 ${hovered === post.id && "opacity-100"} transition-all duration-300 ease-in-out w-full z-99 bg-(--surface)`}>
                                <div className="flex text-xs justify-between text-(--text-muted) items-center">
                                    <div>
                                        {post.user.image && <Image src={post.user.image} alt="" width={30} height={30} className="rounded-full" />}
                                        <div>{post.user.name}</div>
                                    </div>
                                    <div>{postTime(post.createdAt)}</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="font-serif text-lg">{post.title}</div>
                                    {/* <div className="font-sans text-xs text-(--text-muted)">{post.description}</div> */}
                                    <div className="flex flex-wrap gap-2 text-xs text-(--text-muted)">
                                        {post.medium.map((med, i) => (
                                            <div key={i} className="border border-border bg-(--surface) py-1 px-2 rounded-lg">
                                                {mediumLabels[med]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <hr className="border border-border" />
                                <div className="flex gap-5">
                                    <div className="text-xs flex gap-2 w-fit text-(--text-muted)">
                                        <Heart className="w-4 h-4 inline" />
                                        {post._count.likes}
                                    </div>
                                    <div className="text-xs flex gap-2 w-fit text-(--text-muted)">
                                        <MessageSquare className="w-4 h-4 inline" />
                                        {post._count.comments}
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    )
}