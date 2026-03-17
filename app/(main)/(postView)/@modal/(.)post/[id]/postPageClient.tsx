import { Spinner } from "@/components/ui/spinner";
import ArtImagesServer from "@/src/components/post/ArtImagesServer";
import PostDetailsServer from "@/src/components/post/PostDetailsServer";
import PostOwnerDetailsServer from "@/src/components/post/PostOwnerDetailsServer";
import { Suspense } from "react";

export default async function PostPageClient({ postId, sessionUserId }: { postId: string, sessionUserId: string }) {
    return (
        <div className="flex justify-between w-full gap-10 h-full min-h-0">
            <div className="postImages w-[70%] flex justify-center overflow-y-auto">
                <Suspense fallback={<Spinner />}>
                    <ArtImagesServer postId={postId} />
                </Suspense>
            </div>
            <div className="w-[30%] overflow-y-auto min-h-0 no-scrollbar">
                <div className="flex flex-col gap-5 w-full">
                    <Suspense fallback={<Spinner />}>
                        <PostOwnerDetailsServer postId={postId} userId={sessionUserId} />
                    </Suspense>
                    <Suspense fallback={<Spinner />}>
                        <PostDetailsServer postId={postId} sessionUserId={sessionUserId} />
                    </Suspense>
                </div>
            </div>
        </div>



    )
}