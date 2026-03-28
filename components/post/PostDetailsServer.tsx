"use server"

import { getPostDetails } from "@/src/dal/Post/queries";
import PostDetailsClient from "./PostDetailsClient";

export default async function PostDetailsServer({ id }: { id: string }) {
    const result = await getPostDetails(id)
    if (!result) {
        return null;
    }
    const { postInfo, sessionUserId } = result;
    return (
        <PostDetailsClient postInfo={postInfo} sessionUserId={sessionUserId} />
    )
}