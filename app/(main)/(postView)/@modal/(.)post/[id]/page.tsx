"use server"

import PostModal from "./postModal";
import PostFetch from "./postFetch";
import { Suspense } from "react";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    return (
        <PostModal>
            <Suspense>
                <PostFetch params={params} />
            </Suspense>
        </PostModal>
    )
}