"use client"

import { PostOwnerDetails } from "@/src/dal/posts";
import Image from "next/image";
import { motion } from "motion/react"

export default function PostOwnerDetailsClient({ postOwnerDetails }: { postOwnerDetails: PostOwnerDetails }) {
    // const userDetails = [
    //     {
    //         value: postOwnerDetails?.user._count.artPosts,
    //         label: "Posts"
    //     },
    //     {
    //         value: postOwnerDetails?.user._count.followers,
    //         label: "Followers"
    //     },
    //     {
    //         value: postOwnerDetails?.user._count.following,
    //         label: "Followings"
    //     }
    // ]
    return (
        <motion.div className="userDetails bg-(--surface) w-full p-7 flex flex-col gap-5 self-start rounded-lg border border-(--border)"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex gap-3">
                <div>
                    {postOwnerDetails?.user.image && <Image src={postOwnerDetails.user.image} alt="" width={60} height={60} className="rounded-full" />}
                </div>
                <div>
                    <div className="font-serif">
                        {postOwnerDetails?.user.name}
                    </div>
                    <div className="text-sm text-(--text-subtle)">
                        {postOwnerDetails?.user.username}
                    </div>
                </div>
            </div>
            <div className="text-(--text-muted) font-sans text-sm">
                {postOwnerDetails?.user.bio}
            </div>
            {/* <div className="flex bg-(--surface2)">
                {
                    userDetails.map((det, i) => (
                        <div key={i} className={`flex flex-col justify-center p-1 items-center w-1/3 ${i === 1 && "border-l border-r border-border"}`}>
                            <div className="text-lg">{det.value}</div>
                            <div className="text-sm font-serif text-(--text-light)">{det.label}</div>
                        </div>
                    ))
                }
            </div> */}
            {postOwnerDetails?.user.followers.length ? <button>Following</button> : <button className="bg-(--amber) p-2 text-black font-semibold font-sans rounded-lg hover:-translate-y-1 transition-all duration-300">Follow</button>}
        </motion.div>
    )
}