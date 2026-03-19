"use server"

import PostPageClient from "./postPageClient"
import { getUserSession } from "@/src/utils/getUserSession";

export default async function PostFetch({ params }: { params: Promise<{ id: string }> }) {
    const [{ id }, session] = (await Promise.all([
        params,
        getUserSession()
    ]));
    return (
        <PostPageClient postId={id} sessionUserId={session.user.id} />
    )
}