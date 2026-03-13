"use client"

import Image from "next/image";
import { Divide, Heart, MessageSquare } from "lucide-react";
import { useState } from "react";
import { mediumLabels, postTime } from "@/src/utils/postUtils";
import { useRouter } from "next/navigation";
import { Post, Posts } from "@/src/dal/posts";
import PostModal from "./postModal";


export default function HomePageClient({ posts }: { posts: Posts }) {
    const router = useRouter()
    const [hovered, setHovered] = useState("")
    const [loading, setLoading] = useState(true)
    const [openedPost, setOpenedPost] = useState<Post | null>(null)
    return (
        <div>
            {openedPost && (
                <PostModal post={openedPost}/>
            )}
        <div className="grid grid-cols-5 gap-4">
            {
                posts?.map(post => (
                    // <Link href={`/post/${post.id}`} key={post.id}>
                    <div key={post.id} onClick={() => setOpenedPost(post)} onMouseLeave={() => setHovered("")} onMouseEnter={() => setHovered(post.id)} className="w-70 h-70 relative bg-(--surface2) overflow-hidden">
                        {loading && (
                            <div className="absolute inset-0 animate-pulse bg-white/3" />
                        )}
                        <Image loading="lazy" src={post.artImages[0]} alt="" fill className={`object-cover transition-opacity duration-500 ${loading ? "opacity-0" : "opacity-100"
                            }`}
                            onLoad={() => setLoading(false)} />
                        <div className={`p-4 flex flex-col gap-3 absolute bottom-0 opacity-0 ${hovered === post.id && "opacity-100"} transition-all duration-800 ease-in-out w-full z-9 bg-(--surface)`}>
                            <div className="flex text-xs justify-between text-(--text-muted) items-center">
                                <div className="flex gap-3 items-center">
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
                    // </Link>
                ))
            }
        </div>
        </div>
    )
}