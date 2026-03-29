"use server"

import { Suspense } from "react";
import PostModal from "./postModal";
import ArtImagesServer from "@/src/app/(main)/(postView)/@modal/(.)post/[id]/_components/ArtImagesServer";
import PostDetailsServer from "@/src/app/(main)/(postView)/@modal/(.)post/[id]/_components/PostDetailsServer";
import PostDetailsModal from "./_components/PostDetailsModal";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <PostModal
            images={
                <Suspense>
                    <ArtImagesServer id={id} />
                </Suspense>
            }
            details={
                <PostDetailsModal>
                    <Suspense>
                        <PostDetailsServer id={id} />
                    </Suspense>
                </PostDetailsModal>
            }
        />
    )
}