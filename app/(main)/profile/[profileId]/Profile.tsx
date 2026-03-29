"use client"

import FollowList from "@/src/components/FollowList";
import ProfilePostsGrid from "@/src/components/Navbar/UIComponent";
import { getProfileData, ProfileData } from "@/src/data/dal/user-queries";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type user = {
    userId: string | undefined;
    name: string | undefined;
    username: string | null | undefined;
    image: string | null | undefined;
    profileCreated: boolean | undefined;
    email: string | undefined;
}

function groupOptions(id: number, userId: string) {
    return queryOptions({
        queryKey: ['ProfilePage', id],
        queryFn: async () => await getProfileData(id, userId),
        staleTime: 10 * 60 * 1000,
    })
}

export default function Profile({ user }: { user: user }) {
    if (!user || !user.userId) return <div>user not found</div>;
    const [selectedTab, setSelectedTab] = useState(0)
    const { isPending, isError, data, error } = useQuery(groupOptions(selectedTab, user.userId));
    return (
        <div className="w-full flex justify-center p-5">
            <div className="w-[55%] flex flex-col gap-7">
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
                            {user.image && <Image src={user.image} alt="" width={90} height={90} className="rounded-full border border-(--amber)" />}
                            <div className="">
                                <div className="font-serif text-xl tracking-wide">{user.name}</div>
                                <div className="text-sm text-(--text-subtle)">@{user.username}</div>
                            </div>
                        </div>
                        <a href="/">
                            <button className="py-2 px-3 border button-1 flex gap-2 text-xs items-center"><Edit className="w-4 h-4" /> edit profile</button>
                        </a>
                    </div>
                    <div className="text-(--text-muted) text-sm font-sans font-semibold">
                        {/* {user.bio} */}
                    </div>
                    <div className="flex gap-8">
                        <div>0 <span className="text-sm text-(--text-subtle)">Posts</span></div>
                        <div>0 <span className="text-sm text-(--text-subtle)">Followers</span></div>
                        <div>0 <span className="text-sm text-(--text-subtle)">Followings</span></div>
                    </div>
                </div>

                <div className="box p-4 px-7 flex gap-10 w-fit">
                    {["Posts", "Saved", "Followers", "Following"].map((tab, i) => (

                        <div key={i} className="relative cursor-pointer" onClick={() => setSelectedTab(i)}>
                            <div className={`font-sans text-sm text-(--text-muted) ${selectedTab === i && "relative z-5 text-black"} `} >{tab}</div>
                            {selectedTab === i && (
                                <div className="bg-amber-400 py-4 px-9 rounded-sm absolute top-1/2 -translate-1/2 left-1/2"></div>
                            )}
                        </div>
                    ))}
                </div>
                {/* <div className="box p-5">
                    {data && <ProfileTabContent data={data} />}
                </div> */}
            </div>
        </div>
    )
}

// function ProfileTabContent({ data }: { data: ProfileData }) {
//     if (!data) return null;
//     switch (data.type) {
//         case "posts":
//         case "saved":
//             if (!data.data) return null;
//             return <ProfilePostsGrid posts={data.data} />
//         case "followers":
//             return (
//                 <FollowList
//                     users={data.data.map((f) => f.follower)}
//                     emptyMessage="No followers yet"
//                 />
//             );
//         case "following":
//             return (
//                 <FollowList
//                     users={data.data.map((f) => f.following)}
//                     emptyMessage="Not following anyone yet"
//                 />
//             );
//     }
// }
