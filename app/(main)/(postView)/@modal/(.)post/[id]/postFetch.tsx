"use server"

import { headers } from "next/headers";
import PostPageClient from "./postPageClient"
import { auth } from "@/src/lib/better-auth/auth"
import { redirect } from "next/navigation";

export default async function PostFetch({ params }: { params: Promise<{ id: string }> }) {
    const [{ id }, session] = await Promise.all([
        params,
        auth.api.getSession({ headers: await headers() })
    ]);
    if (!session) redirect("/login")
    return (
        <PostPageClient postId={id} sessionUserId={session.user.id} />
    )
}