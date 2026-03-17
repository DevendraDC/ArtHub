"use server"

import { getPostOwnerDetails } from "@/src/dal/posts";
import PostOwnerDetailsClient from "./PostOwnerDetailsClient";

export default async function PostOwnerDetailsServer({ postId, userId }: { postId: string, userId: string }) {
    const postOwnerDetails = await getPostOwnerDetails(postId, userId);
    return (
        <PostOwnerDetailsClient postOwnerDetails={postOwnerDetails} />
    )
}