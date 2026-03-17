"use server"

import { headers } from "next/headers";
import PostPageClient from "./postPageClient"
import { auth } from "@/src/lib/better-auth/auth"
import { redirect } from "next/navigation";

export default async function PostFetch({ postId }: { postId: string }) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/login")
    return (
        <PostPageClient postId={postId} sessionUserId={session.user.id} />
    )
}