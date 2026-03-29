"use server"

import { getPostDetails } from "@/src/data/dal/Post/queries";
import PostDetailsClient from "./PostDetailsClient";

export default async function PostDetailsServer({ id }: { id: string }) {
    const result = await getPostDetails(id)
    if (!result) {
        return null;
    }
    return (
        <PostDetailsClient post={result} />
    )
}