"use client"

import { SortByBox } from "@/src/components/ComboBox"
import { SelectMediums, SelectTags } from "@/src/components/PostComponents";
import { getSearchedPosts, SearchedPosts } from "@/src/dal/posts";
import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { useEffect, useState } from "react"
import HomePagePosts from "../../HomePagePosts";

export default function Page() {
    const [selectedMediums, setSelectedMediums] = useState<PostMedium[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("latest");
    const [keyword, setKeyword] = useState("");
    const [posts, setPosts] = useState<SearchedPosts>(null)

    useEffect(() => {
        const timeout = setTimeout(async () => {
            handleSearch();
        }, 400);

        return () => clearTimeout(timeout);
    }, [keyword, selectedMediums, selectedTags, sortBy]);

    const handleSearch = () => {
        const getPosts = async () => {
            const allPosts = await getSearchedPosts(selectedTags, selectedMediums, sortBy, keyword);
            setPosts(allPosts);
        }
        getPosts();
    }

    return (
        <div className="bg-(--bg) w-full flex justify-center">
            <div className="w-[85%] p-3 flex flex-col gap-4">
                <div className="w-fit flex flex-col gap-2">
                    <div>Sort posts</div>
                    <SortByBox sortBy={sortBy} setSortBy={setSortBy} />
                </div>
                <div className="flex gap-3">
                    <div className="flex-2 flex flex-col gap-2">
                        <div>Mediums</div>
                        <SelectMediums selectedMediums={selectedMediums} setSelectedMediums={setSelectedMediums} />
                    </div>
                    <div className="w-fit flex-1 flex flex-col gap-2">
                        <div>Tags</div>
                        <SelectTags selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
                    </div>
                </div>
                <div className="flex flex-col w-[40%] gap-2 mb-5">
                    <div>Search</div>
                    <input type="text" placeholder="Search for Artworks" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="p-2 bg-(--surface2) border rounded-sm border-border placeholder:text-(--text-subtle) text-sm focus:outline-0 text-(--text-light)" />
                </div>
                {/* <button onClick={handleSearch} className="p-1 bg-amber-400 rounded-sm text-black font-sans font-semibold">Search</button> */}

                {posts && <HomePagePosts posts={posts} />}
            </div>
        </div>
    )
}