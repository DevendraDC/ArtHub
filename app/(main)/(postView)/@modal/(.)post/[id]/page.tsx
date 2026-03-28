"use server"

import { Suspense } from "react";
import PostModal from "./postModal";
import ArtImagesServer from "@/src/components/post/ArtImagesServer";
import PostDetailsServer from "@/src/components/post/PostDetailsServer";

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
                <Suspense>
                    <PostDetailsServer id={id} />
                </Suspense>
            }
        />
    )
}