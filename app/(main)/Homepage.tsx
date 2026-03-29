"use client";

import { useEffect, useMemo, useState } from "react";
import { getPosts } from "@/src/dal/Post/queries";
import PostsView from "@/src/components/post/PostsView";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LoadingDots } from "@/src/components/animations";


function groupOptions(id: number) {
    return queryOptions({
        queryKey: ['HomePagePosts', id],
        queryFn: async () => await getPosts(id),
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}

export function HomePageClient() {
    const [curFilter, setCurFilter] = useState(0);
    const tabs = ["All Posts", "Following", "Popular Posts"];
    const { isLoading, isError, data, error } = useQuery(groupOptions(curFilter));
    const posts = useMemo(() => data ?? [], [data]);
    useEffect(() => {
        if (error) toast(error?.message);
    }, [isError, error])
    const tabw = ["w-20", "w-25", "w-30"]

    return (
        <div className="flex justify-center">
            <div className="w-[90%] flex flex-col justify-center items-center gap-8 p-5">
                <div className="flex sticky z-99 items-center gap-10 bg-white/8 w-fit p-5 text-(--bl0)/50 text-sm rounded-3xl">
                    {tabs.map((tab, i) => (
                        <div
                            key={i}
                            onClick={() => setCurFilter(i)}
                            className={`${curFilter === i && " text-white rounded-3xl transition-all duration-500 "} cursor-pointer text-[1rem]`}
                        >
                            <div className="relative">
                                <span className="relative z-9">{tab}</span>
                                {curFilter === i && (
                                    <motion.div className={`bg-blue-700 top-1/2 left-1/2 -translate-1/2 rounded-2xl absolute ${tabw[i]} h-12`} initial={{ opacity: 0, y: 0 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}></motion.div>
                                )}
                            </div>

                        </div>

                    ))}
                </div>

                {isLoading ? (
                    <div className="scale-110 absolute left-1/2 top-1/2 -translate-1/2"><LoadingDots /></div>
                ) : (
                    <PostsView posts={posts} />
                )}
            </div>
        </div>
    );
}