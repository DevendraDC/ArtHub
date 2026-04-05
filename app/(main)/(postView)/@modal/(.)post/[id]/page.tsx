"use server"

import { Suspense } from "react";
import PostModal from "./postModal";
import ArtImagesServer from "@/app/(main)/(postView)/@modal/(.)post/[id]/_components/ArtImagesServer";
import PostDetailsServer from "@/app/(main)/(postView)/@modal/(.)post/[id]/_components/PostDetailsServer";
import PostDetailsModal from "./_components/PostDetailsModal";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    return (
        <PostModal
            images={
                <Suspense>
                    <ArtImagesServer params={params} />
                </Suspense>
            }
            details={
                <PostDetailsModal>
                    <Suspense fallback={<Skeleton/>}>
                        <PostDetailsServer params={params} />
                    </Suspense>
                </PostDetailsModal>
            }
        />
    )
}


function Skeleton(){
    return (
        <div className="flex flex-col w-full h-60 gap-5 animate-pulse [animation-duration:1s]">
            <div className="flex-1 bg-white/10 rounded-lg"></div>
            <div className="flex-2 bg-white/10 rounded-lg"></div>           
        </div>
    )
}