"use client";

import { useEffect, useRef, useState } from "react";
import { getPosts } from "@/data/dal/Post/queriesActions";
import PostsView from "@/components/post/PostsView";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LoadingDots } from "@/components/animations";
import { useQueryState } from "nuqs";
import { useRouter, useSearchParams } from "next/navigation";


export function HomePageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
        if(!searchParams.get("sortBy")) router.replace("?sortBy=Trending")
    }, [searchParams, router])
    const [sortBy, setSortBy] = useQueryState("sortBy", {
        defaultValue: "Trending"
    })
    const tabs = ["Trending", "Latest"];
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        isLoading,
        isError
    } = useInfiniteQuery({
        queryKey: ["posts", sortBy],
        queryFn: ({ pageParam }) => getPosts(sortBy, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        staleTime: 10 * 60 * 1000,
        // refetchOnWindowFocus: false,
        // refetchOnMount: false,
    });
    const posts = data?.pages.flatMap((page) => page.data) ?? [];
    useEffect(() => {
        if (error) toast(error?.message);
    }, [isError, error])
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }, { rootMargin: "200px", threshold: 0 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
    const tabw = ["w-20", "w-17"]

    return (
        <div className="flex justify-center">
            <div className="w-[98%] flex flex-col justify-center items-center gap-8 p-5">
                <div className="flex sticky z-99 items-center gap-10 bg-white/8 w-fit p-4 px-6 text-sm text-blue-100/50 rounded-3xl">
                    {tabs.map((tab, i) => (
                        <div
                            key={i}
                            onClick={() => setSortBy(tab)}
                            className={`${sortBy === tab && " text-white rounded-3xl transition-all duration-500 "} cursor-pointer text-sm`}
                        >
                            <div className="relative">
                                <span className="relative z-9">{tab}</span>
                                {sortBy === tab && (
                                    <motion.div className={`bg-blue-700 top-1/2 left-1/2 -translate-1/2 rounded-2xl absolute ${tabw[i]} h-9`} initial={{ opacity: 0, y: 0 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}></motion.div>
                                )}
                            </div>

                        </div>

                    ))}
                </div>

                {isLoading ? (
                    <div className="scale-110 absolute left-1/2 top-1/2 -translate-1/2">
                        <LoadingDots />
                    </div>
                ) : (
                    <>
                        <PostsView posts={posts} />
                        <div ref={ref} className="h-10" />
                        {isFetchingNextPage && (
                            <div className="scale-110 py-4"><LoadingDots /></div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}