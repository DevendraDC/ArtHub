import { getPostInformation, getPostStats } from "@/data/dal/Post/queries";
import { mediumLabels } from "@/utils/postUtils";
import Image from "next/image";
import { Suspense } from "react";
import PostDetails from "./PostStats";
import Comments from "./PostComments";
import Link from "next/link";
import { getUserSession } from "@/data/dal/getUserSession";
import DeletePostComponent from "./DeletePost";

export default async function PostDetailsModal({ postId }: { postId: string }) {
    const postInfoResult = getPostInformation(postId);
    const postStatsResult = getPostStats(postId);
    const session = getUserSession()
    const res = await Promise.all([postInfoResult, postStatsResult, session])
    const date = new Date(res[0].data?.createdAt ?? Date.now());
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return (
        <div className="w-full min-h-full flex flex-col gap-8 bg-black p-5 rounded-r-2xl">
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <section className="flex gap-3">
                        <div>
                            {res[0].data?.user.image && <Link href={`/profile/${res[0].data.user.username}`}><Image src={res[0].data.user.image} alt="" width={60} height={60} className="rounded-full cursor-pointer" /></Link>}
                        </div>
                        <div>
                            <div className="font-serif">
                                {res[0].data?.user.name}
                            </div>
                            <div className="text-sm text-white/40">
                                {res[0].data?.user.username}
                            </div>
                        </div>
                    </section>

                    {res[0].data && res[2] && res[2].user.username && res[2].user.id === res[0].data.authorId && (
                        // <button className="cursor-pointer"><Trash className="text-red-700"/></button>
                        <DeletePostComponent postId={postId} username={res[2].user.username} />
                    )}
                </div>
                <section>
                    <div className="text-2xl font-serif">
                        {res[0].data?.title}
                    </div>
                    {res[0].data?.description && <div className="text-white/60 wrap-break-word min-w-0">
                        {res[0].data?.description}
                    </div>}
                    <div className="text-sm text-white/30 flex gap-2 items-center">
                        {time}
                        <span className="text-xl text-white/50">&middot;</span>
                        {dateStr}
                    </div>
                </section>
                <section>
                    <Suspense>
                        <PostDetails postStats={res[1]} />
                    </Suspense>
                </section>
                <div className="Mediums flex flex-col gap-3">
                    <h1>Mediums</h1>
                    <div className="flex flex-wrap gap-3">
                        {res[0].data?.mediums.map((med, i) => {
                            if(med) return (
                                <div key={i} className="p-2 rounded-lg border border-white/35 text-white/70 text-xs">
                                {mediumLabels[med]}
                            </div>
                            )
                        })}
                    </div>
                </div>
                {res[0].data?.tags.length && (
                    <div className="tags flex flex-col gap-3">
                        <h1>Tags</h1>
                        <div className="flex flex-wrap gap-3">
                            {res[0].data?.tags.map((tag, i) => {
                                if (tag !== "") return (
                                    <div key={i} className="text-blue-400/80 font-sans text-sm">
                                        #{tag}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                <Suspense>
                    <Comments session={res[2]} postId={postId} />
                </Suspense>

            </div>
        </div>
    )
}


