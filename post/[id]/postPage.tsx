"use server"

import { getSession } from "@/src/utils/getSession"
import PostPageClient from "./postPageClient"
import { getPosts } from "@/src/dal/posts"

export default async function PostPage({ postId }: { postId: string }) {
    const session = await getSession()
    const posts = await getPosts(session.user.id)
    return (
        <PostPageClient posts={posts} />
    )
}