"use client"

import { sessionType } from "@/src/app/(main)/edit-profile/editProfile";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


export default function Profile({ userSession }: { userSession: sessionType }) {
    const [selectedTab, setSelectedTab] = useState("Posts")
    return (
        <div className="w-full flex justify-center p-5">
            <div className="w-[55%] flex flex-col gap-7">
                <div>
                    <div className="text-sm flex gap-3"><span className="text-amber-400">Home</span><span className="text-white/60">&gt;</span><span className="text-(--text-subtle)">profile</span></div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-serif text-4xl">Your Profile</div>
                    <div className="text-sm text-(--text-muted)">You can view and change your profile details from here</div>
                </div>
                {/* profile details */}
                <div className="details box p-5 px-6 flex flex-col gap-4">
                    <div className="w-full flex justify-end mb-6">
                        <a href="/create-post">
                            <button className="bg-amber-400 hover:scale-102 transition-all duration-100 ease-in-out text-xs font-semibold font-sans py-1 px-3 rounded-sm text-black">+ Create Post</button>
                        </a>
                    </div>
                    <div className="profilePhoto flex justify-between">
                        <div className="flex gap-3 items-center">
                            {userSession.user.image && <Image src={userSession.user.image} alt="" width={90} height={90} className="rounded-full border border-(--amber)" />}
                            <div className="">
                                <div className="font-serif text-xl tracking-wide">{userSession.user.name}</div>
                                <div className="text-sm text-(--text-subtle)">@{userSession.user.username}</div>
                            </div>
                        </div>
                        <a href="/">
                            <button className="py-2 px-3 border button-1 flex gap-2 text-xs items-center"><Edit className="w-4 h-4" /> edit profile</button>
                        </a>
                    </div>
                    <div className="text-(--text-muted) text-sm font-sans font-semibold">
                        {userSession.user.bio}
                        kjnjkdsgkjbdsjkg
                    </div>
                    <div className="flex gap-8">
                        <div>0 <span className="text-sm text-(--text-subtle)">Posts</span></div>
                        <div>0 <span className="text-sm text-(--text-subtle)">Followers</span></div>
                        <div>0 <span className="text-sm text-(--text-subtle)">Followings</span></div>
                    </div>
                </div>

                <div className="box p-4 px-7 flex gap-10 w-fit">
                    {["Posts", "Saved", "Followers", "Following"].map((tab, i) => (

                        <div key={i} className="relative cursor-pointer" onClick={() => setSelectedTab(tab)}>
                            <div className={`font-sans text-sm text-(--text-muted) ${selectedTab === tab && "relative z-5 text-black"} `} >{tab}</div>
                            {selectedTab === tab && (
                                <div className="bg-amber-400 py-4 px-9 rounded-sm absolute top-1/2 -translate-1/2 left-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="box p-5">

                </div>
            </div>
        </div>
    )
}