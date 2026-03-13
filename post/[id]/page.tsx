
import PostPage from "./postPage";
import { Suspense } from "react";


export default async function Page({ params }: {  params: Promise<{ id: string }> }) {

    const {id} = await params

    return (
        <div className="bg-(--bg) flex justify-center">
            <div className="w-[70%] flex flex-col gap-8">
            
                    {/* <div className="flex gap-2 text-(--text-muted)">
                        &larr;
                        <div>
                            Back to Feed
                        </div>
                    </div> */}
            

                <Suspense>
                    <PostPage postId={id} />
                </Suspense>

            </div>
        </div>
    )
}