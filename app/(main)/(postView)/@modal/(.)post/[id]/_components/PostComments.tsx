import { getPostComments } from "@/data/dal/Post/queries";
import { MessageSquareOff } from "lucide-react";

export default async function PostComments({ postId }: { postId: string }) {
    const { success, data } = await getPostComments(postId);
    if (!success) return null;
    return (
        <main>
            {!data || data.length === 0 && (
                <div className="text-white text-center">
                    <MessageSquareOff size={40} className="mx-auto mb-3" />
                    <p>There are no comments for this post yet</p>
                </div>
            )}
        </main>
    )
}