"use client"

import FollowList from "@/components/FollowList";
import ProfilePostsGrid from "@/components/Navbar/UIComponent";
import { getProfileData, ProfileData } from "@/data/dal/user-queries";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    Edit,
    MapPin,
    Link as LinkIcon,
    Palette,
    Image as ImageIcon,
    Users,
    UserPlus,
    Loader2,
} from "lucide-react";
import { useState } from "react";


function groupOptions(id: number, userId: string) {
    return queryOptions({
        queryKey: ["ProfilePage", id, userId],
        queryFn: async () => await getProfileData(id, userId),
        staleTime: 10 * 60 * 1000,
    });
}

const TABS = [
    { label: "Posts", icon: ImageIcon },
    { label: "Saved", icon: Palette },
    { label: "Followers", icon: Users },
    { label: "Following", icon: UserPlus },
];

export default function Tabs({ userId }: { userId: string }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const { isPending, isError, data, error } = useQuery(
        groupOptions(selectedTab, userId),
    );
    return (
        <div className="mt-12 w-full">
            <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                {TABS.map((tab, i) => {
                    const Icon = tab.icon;
                    const isActive = selectedTab === i;
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedTab(i)}
                            className={`
                    relative flex items-center gap-2 py-3 px-6 rounded-full text-sm font-semibold transition-all
                    ${isActive ? "text-blue-500" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}
                  `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-amber-500/10 border border-amber-500/30 rounded-full -z-10"
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 min-h-100"
                >
                    {isPending ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            <p className="text-sm font-medium animate-pulse">
                                Loading {TABS[selectedTab].label}...
                            </p>
                        </div>
                    ) : isError ? (
                        <div className="flex items-center justify-center h-64 text-red-500 bg-red-500/10 rounded-2xl border border-red-500/20">
                            Failed to load data. Please try again later.
                        </div>
                    ) : data ? (
                        <ProfileTabContent data={data} />
                    ) : null}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}



function ProfileTabContent({ data }: { data: ProfileData }) {
    if (!data) return null;
    switch (data.type) {
        case "posts":
        case "saved":
            if (!data.data || data.data.length === 0) {
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-secondary/20 rounded-3xl border border-border/50 border-dashed">
                        <Palette className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground">
                            No {data.type} yet
                        </h3>
                        <p className="text-sm mt-1">
                            When you create or save posts, they'll appear here.
                        </p>
                    </div>
                );
            }
            return <ProfilePostsGrid posts={data.data} />;
        case "followers":
            if (!data.data || data.data.length === 0) {
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-secondary/20 rounded-3xl border border-border/50 border-dashed">
                        <Users className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground">
                            No followers yet
                        </h3>
                    </div>
                );
            }
            return (
                <FollowList
                    users={data.data.map((f: any) => f.follower)}
                    emptyMessage="No followers yet"
                />
            );
        case "following":
            if (!data.data || data.data.length === 0) {
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground bg-secondary/20 rounded-3xl border border-border/50 border-dashed">
                        <UserPlus className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium text-foreground">
                            Not following anyone
                        </h3>
                    </div>
                );
            }
            return (
                <FollowList
                    users={data.data.map((f: any) => f.following)}
                    emptyMessage="Not following anyone yet"
                />
            );
        default:
            return null;
    }
}