import { getPostComments } from "@/data/dal/Post/queries";
import { MessageSquareOff } from "lucide-react";

export default async function PostComments({postId}: {postId: string}){
    const {success, data} = await getPostComments(postId);
    if(!success) return null;
    if(!data || data.length === 0){
        return (
            <div className="text-white/60 font-sans text-center">
                <MessageSquareOff size={40} className="mx-auto mb-3"/>
                <p>There are no comments available for this post</p>
            </div>
        )
    }
}