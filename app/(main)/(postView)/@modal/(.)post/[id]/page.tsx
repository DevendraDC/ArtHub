"use server"

import PostModal from "./postModal";
import { Suspense } from "react";
import { getUserSession } from "@/src/utils/getUserSession";
import PostPageClient from "./postPageClient";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const session = getUserSession();
    const sessionUserId = session.then(s => s.user.id);
    const postId = params.then(p => p.id);
    return (
        <PostModal>
            <Suspense>
                {/* <PostFetch params={params} /> */}
                <PostPageClient postId={postId} sessionUserId={sessionUserId}/>
            </Suspense>
        </PostModal>
    )
}