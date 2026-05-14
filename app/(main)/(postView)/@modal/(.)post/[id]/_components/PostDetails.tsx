import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import OptimisticFollow from "@/components/User/OptimisticFollow";
import OptimisticLike from "@/components/User/OptimisticLike";
import { Bookmark, MessageSquare } from "lucide-react";
import { getPostTitleAndDesc } from "@/data/dal/Post/queries";
import { Suspense } from "react";
import PostStats from "./PostStats";

export default async function PostDetails({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return (
        <h1>Session not found</h1>
    )
    const userId = session.user.id;
    const { id } = await params;
    return (
        <div className="w-full flex flex-col gap-5">
            {/* <div className="w-full mb-3">
                <OptimisticFollow data={{
                    isFollowing: !!postInfo.user.followers.length,
                    postOwnerId: sessionUserId,
                    userId: postInfo.user.id
                }} />
            </div> */}

            <div className="postDetails w-full flex flex-col gap-2 self-start">
                <PostStats postId={id} userId={userId} />
            </div>
        </div>
    )
}

