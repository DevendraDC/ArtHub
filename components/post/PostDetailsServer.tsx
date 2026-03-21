"use server"

import { getPostDetails } from "@/src/dal/posts";
import PostDetailsClient from "./PostDetailsClient";

export default async function PostDetailsServer({ postId, sessionUserId }: { postId: Promise<string>, sessionUserId: Promise<string> }){
    const [id, userId] = await Promise.all([postId, sessionUserId])
    const postDetails = await getPostDetails(id, userId)
    return (
        <PostDetailsClient postDetails={postDetails} sessionUserId={userId} />
    )
}