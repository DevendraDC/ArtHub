import { Bookmark, Heart, MessageSquare } from "lucide-react";
import { PostStatsType } from "@/data/dal/Post/queries";
import OptimisticLike from "@/components/User/OptimisticLike";
import { Suspense } from "react";
import OptimisticSave from "@/components/User/OptimisticSave";

export default async function PostDetails({ postStats }: { postStats: PostStatsType }) {
    const comments = postStats?.data?.post?._count.comments;
    const likes = postStats?.data?.post?._count.likes;
    const saves = postStats?.data?.post?._count.savedBy;
    if (!postStats.data?.session || !postStats.data.session.user.username || !postStats.data.session.user.name) {
        return (
            <ul className="flex gap-3 text-white/70 items-center text-sm">
                <li>{likes} likes</li>
                <li className="scale-180">&middot;</li>
                <li>{comments} comments</li>
                <li className="scale-180">&middot;</li>
                <li>{saves} saves</li>
            </ul>
        )
    }
    const postId = postStats.data?.post?.id ?? "";
    const userId = postStats?.data?.session?.user.id;
    const isLiked = !!postStats?.data?.post?.likes.length;
    const isSaved = !!postStats?.data?.post?.savedBy.length;
    return (
        <>
            <div className="border border-white/20"></div>
            <div className="flex gap-10 p-1 text-(--text-light)">
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
                <OptimisticSave data={{
                    isSaved,
                    saves: saves ?? 0,
                    postId,
                    userId
                }} />
            </div >
            <div className="border border-white/20"></div>
        </>
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
    const postStats = await promise;
    if (!postStats.success || !postStats.data?.post) return null;
    const comments = postStats?.data?.post?._count.comments;
    const likes = postStats?.data?.post?._count.likes;
    const saves = postStats?.data?.post?._count.savedBy;
    if (!postStats.data.session || !postStats.data.session.user.username || !postStats.data.session.user.name) {
        return (
            <ul className="flex gap-3 text-white/70 items-center text-sm">
                <li>{likes} likes</li>
                <li className="scale-180">&middot;</li>
                <li>{comments} comments</li>
                <li className="scale-180">&middot;</li>
                <li>{saves} saves</li>
            </ul>
        )
    }
    const postId = postStats.data?.post?.id;
    const userId = postStats?.data?.session?.user.id;
    const isLiked = !!postStats?.data?.post?.likes.length;
    const isSaved = !!postStats?.data?.post?.savedBy.length;
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
                <OptimisticSave data={{
                    isSaved,
                    saves: saves ?? 0,
                    postId,
                    userId
                }} />
            </div >
            <div className="border border-white/20"></div>
        </>
    )
}

