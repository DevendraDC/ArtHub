"use server"

import { getPostDetails } from "@/src/dal/posts";
import PostDetailsClient from "./PostDetailsClient";

export default async function PostDetailsServer({ postId, sessionUserId }: { postId: string, sessionUserId: string }){
    const postDetails = await getPostDetails(postId, sessionUserId)
    return (
        <PostDetailsClient postDetails={postDetails} sessionUserId={sessionUserId} />
    )
}