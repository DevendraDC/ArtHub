import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { PostStatsType } from "@/data/dal/Post/queries";
import OptimisticLike from "@/components/User/OptimisticLike";
import { Suspense } from "react";

export default async function PostDetails({ promise }: { promise: Promise<PostStatsType> }) {
    return (
        <div className="w-full flex flex-col gap-5">
            <div className="postDetails w-full flex flex-col gap-2 self-start">
                <Suspense>
                    <PostStats promise={promise} />
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

export async function PostStats({ promise }: { promise: Promise<PostStatsType> }) {
    const result = await promise;
    if (!result.success || !result.data?.post) return null;
    const comments = result?.data?.post?._count.comments;
    const likes = result?.data?.post?._count.likes;
    const collections = result?.data?.post?._count.Collections;
    if (!result.data.session || !result.data.session.user.username || !result.data.session.user.name) {
        return (
            <ul className="flex gap-3 text-white/70 items-center text-sm">
                <li>{likes} likes</li>
                <li className="scale-180">&middot;</li>
                <li>{comments} comments</li>
                <li className="scale-180">&middot;</li>
                <li>{collections} saves</li>
            </ul>
        )
    }
    const postId = result.data?.post?.id;
    const userId = result?.data?.session?.user.id;
    const isLiked = !!result?.data?.post?.likes.length;
    return (
        <>
            <div className="border border-white/20"></div>
            <div className="flex gap-10 text-(--text-light)">
                <OptimisticLike data={{
                    isLiked,
                    likes: likes ?? 0,
                    postId,
                    userId
                }} />

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

