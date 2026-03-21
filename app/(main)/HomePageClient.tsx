"use client";


import { useState, useTransition } from "react";
import { getPosts } from "@/src/dal/posts";
import HomePagePosts from "./HomePagePosts";
import { Posts } from "@/src/dal/posts";
import { Spinner } from "@/components/ui/spinner";

export default function HomePageClient({ initialPosts }: { initialPosts: Posts }) {
    const [curFilter, setCurFilter] = useState(0);
    const [posts, setPosts] = useState<Posts>(initialPosts);
    const [cachedPosts, setCachedPosts] = useState<Record<number, Posts>>({
        0: initialPosts
    });
    const [isPending, startTransition] = useTransition();
    const tabs = ["All Posts", "Following", "Popular Posts"];

    const handleClick = (i: number) => {
        setCurFilter(i);
        if (cachedPosts[i]) {
            setPosts(cachedPosts[i]);
            return;
        }
        startTransition(async () => {
            const newPosts = await getPosts(i);
            setPosts(newPosts);
            setCachedPosts(prev => ({ ...prev, [i]: newPosts }));
        });
    };

    return (
        <div className="bg-(--bg) flex justify-center mt-3">
            <div className="w-[90%] flex flex-col justify-center items-center gap-8 p-5">
                <div className="flex gap-6 bg-(--surface2) w-fit p-2 px-4 text-(--text-muted) text-sm rounded-lg">
                    {tabs.map((tab, i) => (
                        <div
                            key={i}
                            onClick={() => handleClick(i)}
                            className={`${curFilter === i && "text-amber-300"} cursor-pointer`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {isPending ? (
                    <Spinner className="scale-150 absolute left-1/2 top-1/2 -translate-1/2" />
                ) : (
                    <HomePagePosts posts={posts} />
                )}
            </div>
        </div>
    );
}