import { getPostInformation, getPostStats } from "@/data/dal/Post/queries";
import { mediumLabels } from "@/utils/postUtils";
import Image from "next/image";
import { Suspense } from "react";
import PostDetails from "./PostStats";
import Comments from "./PostComments";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import Link from "next/link";

export default async function PostDetailsModal({ postId }: { postId: string }) {
    const postInfoResult = getPostInformation(postId);
    const postStatsResult = getPostStats(postId);
    const { data, success } = await postInfoResult;
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const date = new Date(data?.createdAt ?? Date.now());
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return (
        <div className="w-full min-h-full flex flex-col gap-8 bg-black p-5 rounded-r-2xl">
            <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                    <div>
                        {data?.user.image && <Link href={`/profile/${data.user.username}`}><Image src={data.user.image} alt="" width={60} height={60} className="rounded-full cursor-pointer" /></Link>}
                    </div>
                    <div>
                        <div className="font-serif">
                            {data?.user.name}
                        </div>
                        <div className="text-sm text-white/40">
                            {data?.user.username}
                        </div>
                    </div>
                </div>
                <section>
                    <div className="text-2xl font-serif">
                        {data?.title}
                    </div>
                    {data?.description && <div className="text-white/60 wrap-break-word min-w-0">
                        {data?.description}
                    </div>}
                    <div className="text-sm text-white/30 flex gap-2 items-center">
                        {time}
                        <span className="text-xl text-white/50">&middot;</span>
                        {dateStr}
                    </div>
                </section>
                <section>
                    <Suspense>
                        <PostDetails promise={postStatsResult} />
                    </Suspense>
                </section>
                <div className="Mediums flex flex-col gap-3">
                    <h1>Mediums</h1>
                    <div className="flex flex-wrap gap-3">
                        {data?.mediums.map((med, i) => (
                            <div key={i} className="p-2 rounded-lg border border-white/35 text-white/70 text-xs">
                                {mediumLabels[med]}
                            </div>
                        ))}
                    </div>
                </div>
                {!!data?.tags.length && (
                    <div className="tags flex flex-col gap-3">
                        <h1>Tags</h1>
                        <div className="flex flex-wrap gap-3">
                            {data?.tags.map((tag, i) => (
                                <div key={i} className="text-blue-400/80 font-sans text-sm">
                                    #{tag}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Suspense>
                    <Comments session={session} postId={postId} />
                </Suspense>

            </div>
        </div>
    )
}