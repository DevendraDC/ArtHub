import { Bookmark, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getPostStats } from "@/data/dal/Post/queriesActions";
import OptimisticLike from "@/components/User/OptimisticLike";
import { Suspense } from "react";

export default async function PostDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="w-full flex flex-col gap-5">
            <div className="postDetails w-full flex flex-col gap-2 self-start">
                <Suspense fallback={<PostStatFallback />}>
                    <PostStats postId={id} />
                </Suspense>
            </div>
        </div>
    )
}

export function PostStatFallback() {
    return (
        <>
            <div className="border border-white/20"></div>
            <div className="flex gap-10 text-(--text-light)">
                <div className="flex gap-2 hover:bg-white/10 cursor-pointer w-fit p-2 rounded-lg transition-colors">
                    <Heart
                        size={22}
                        className="transition-colors stroke-current"
                    />
                    <div className="text-white/45"></div>
                </div>

                <div className="flex gap-2 w-fit p-2">
                    <MessageSquare size={22} />
                    <div className="text-white/45"></div>
                </div>
                <div className="flex gap-2 w-fit p-2">
                    <Bookmark size={22} />
                    <div className="text-white/45"></div>
                </div>
            </div >
            <div className="border border-white/20"></div>
        </>
    )
}

export async function PostStats({ postId }: { postId: string }) {
    const data = await getPostStats(postId);
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
                        <Link href={"/login"}>
                            <Heart
                                size={22}
                                className="transition-colors stroke-current"
                            />
                        </Link>

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

