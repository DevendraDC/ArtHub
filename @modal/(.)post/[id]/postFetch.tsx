"use server"

import { getSession } from "@/src/utils/getSession"
import PostPageClient from "./postPageClient"
import { getPost } from "@/src/dal/posts"

export default async function PostFetch({ postId }: { postId: string }) {
    const session = await getSession()
    const post = await getPost(postId, session.user.id)
    return (
        <PostPageClient post={post} />
    )
}