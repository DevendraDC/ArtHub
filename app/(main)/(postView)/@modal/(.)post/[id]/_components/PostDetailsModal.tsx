"use client"

import { usePostStore } from "@/store/usePostStore"
import { mediumLabels } from "@/utils/postUtils";
import { motion } from "framer-motion"
import Image from "next/image";

export default function PostDetailsModal({ postDetails, postComments }: { postDetails: React.ReactNode, postComments: React.ReactNode }) {
    const preview = usePostStore((s) => s.preview);
    if (!preview) return null;
    const date = new Date(preview?.createdAt ?? Date.now());
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return (
        <motion.div className="w-full min-h-full flex flex-col gap-8 bg-black p-5 rounded-r-2xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                    <div>
                        {preview?.user.image && <Image src={preview.user.image} alt="" width={60} height={60} className="rounded-full" />}
                    </div>
                    <div>
                        <div className="font-serif">
                            {preview?.user.name}
                        </div>
                        <div className="text-sm text-white/40">
                            {preview?.user.username}
                        </div>
                    </div>
                </div>
                <section>
                    <div className="text-2xl font-serif">
                        {preview?.title}
                    </div>
                    {preview?.description && <div className="text-white/60 wrap-break-word min-w-0">
                        {preview?.description}
                    </div>}
                    <div className="text-sm text-white/30 flex gap-2 items-center">
                        {time}
                        <span className="text-xl text-white/50">&middot;</span>
                        {dateStr}
                    </div>
                </section>
                <section>
                    {postDetails}
                </section>

                <div className="Mediums flex flex-col gap-3">
                    <h1>Mediums</h1>
                    <div className="flex flex-wrap gap-3">
                        {preview?.mediums.map((med, i) => (
                            <div key={i} className="p-2 rounded-lg border border-white/35 text-white/70 text-xs">
                                {mediumLabels[med]}
                            </div>
                        ))}
                    </div>
                </div>
                {!!preview?.tags.length && (
                    <div className="tags flex flex-col gap-3">
                        <h1>Tags</h1>
                        <div className="flex flex-wrap gap-3">
                            {preview?.tags.map((tag, i) => (
                                <div key={i} className="text-blue-400/80 font-sans text-sm">
                                    #{tag}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <section className="mt-5 flex flex-col gap-5">
                    <h1>Comments</h1>
                    <main>
                        {postComments}
                    </main>
                </section>

            </div>
        </motion.div>
    )
}