"use client"

import { usePostStore } from "@/src/store/usePostStore"
import { mediumLabels } from "@/src/utils/postUtils";
import { motion } from "framer-motion"
import Image from "next/image";

export default function PostDetailsModal({ children }: { children: React.ReactNode }) {
    const preview = usePostStore((s) => s.preview);
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
                        <div className="text-sm text-(--text-subtle)">
                            {preview?.user.username}
                        </div>
                    </div>
                </div>
                {children}
                <div className="Mediums flex flex-col gap-3">
                    <div className="text-sm font-sans tracking-widest text-(--text-light)">
                        MEDIUMS
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {preview?.mediums.map((med, i) => (
                            <div key={i} className="p-2 rounded-lg border border-white/35 text-white/70 text-xs">
                                {mediumLabels[med]}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tags flex flex-col gap-3">
                    <div className="text-sm font-sans tracking-widest text-(--text-light)">
                        TAGS
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {preview?.tags.map((tag, i) => (
                            <div key={i} className="p-2 rounded-lg text-blue-400/80 text-[0.8rem]">
                                # {tag}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}