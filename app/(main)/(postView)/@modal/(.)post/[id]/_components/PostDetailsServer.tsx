"use server"

import { getPostDetails } from "@/data/dal/Post/queries";
import PostDetailsClient from "./PostDetailsClient";

export default async function PostDetailsServer({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const result = await getPostDetails(id)
    if(!result.success || !result.data) return null;
    return (
        <PostDetailsClient post={result} />
    )
}