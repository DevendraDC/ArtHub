"use client";


import { useState } from "react";
import { getPosts } from "@/src/dal/posts";
import { Spinner } from "@/components/ui/spinner";
import PostsView from "@/src/components/post/PostsView";
import { QueryClient, QueryClientProvider, queryOptions, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient();

export default function Page() {
    return (
        <QueryClientProvider client={queryClient}>
            <HomePageClient />
        </QueryClientProvider>
    )
}

function groupOptions(id: number) {
    return queryOptions({
        queryKey: ['HomePagePosts', id],
        queryFn: async () => await getPosts(id),
        staleTime: 10 * 60 * 1000,
    })
}

export function HomePageClient() {
    const [curFilter, setCurFilter] = useState(0);
    const tabs = ["All Posts", "Following", "Popular Posts"];
    const {isPending, isError, data, error} = useQuery(groupOptions(curFilter));
    if(isError){
        toast(error.message);
    }

    return (
        <div className="bg-(--bg) flex justify-center mt-3">
            <div className="w-[90%] flex flex-col justify-center items-center gap-8 p-5">
                <div className="flex gap-6 bg-white/6 w-fit p-2 px-4 text-white/50 text-sm rounded-lg">
                    {tabs.map((tab, i) => (
                        <div
                            key={i}
                            onClick={() => setCurFilter(i)}
                            className={`${curFilter === i && "text-amber-300"} cursor-pointer`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {isPending ? (
                    <Spinner className="scale-150 absolute left-1/2 top-1/2 -translate-1/2" />
                ) : (
                    <PostsView posts={data ?? []} />
                )}
            </div>
        </div>
    );
}