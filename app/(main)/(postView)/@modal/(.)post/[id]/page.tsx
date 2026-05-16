import { Suspense } from "react";
import ArtImages from "@/app/(main)/(postView)/@modal/(.)post/[id]/_components/ArtImages";
import PostDetails from "@/app/(main)/(postView)/@modal/(.)post/[id]/_components/PostDetails";
import PostDetailsModal from "./_components/PostDetailsModal";
import ModalClose from "./_components/ModalCloseButton";
import PostComments from "./_components/PostComments";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    return (
        <main className="absolute inset-0 z-9999 bg-black/10 backdrop-blur-lg flex items-center">
            <section className="flex w-full h-full overflow-hidden">
                <div className="flex flex-6 bg-white/5 backdrop-blur-xl">
                    <ModalClose />
                    <div className="flex items-center justify-center w-full">
                        <Suspense>
                            <ArtImages params={params} />
                        </Suspense>
                    </div>
                </div>
                <div className="flex-2 min-h-full">
                    <PostDetailsModal postDetails={
                        <Suspense>
                            <PostDetails postId={id} />
                        </Suspense>
                    }
                    postComments={
                        <Suspense>
                            <PostComments postId={id} />
                        </Suspense>
                    }>

                    </PostDetailsModal>
                </div>
            </section>
        </main>
    )
}


function Skeleton() {
    return (
        <div className="flex flex-col w-full h-60 gap-5 animate-pulse [animation-duration:1s]">
            <div className="flex-1 bg-white/10 rounded-lg"></div>
            <div className="flex-2 bg-white/10 rounded-lg"></div>
        </div>
    )
}