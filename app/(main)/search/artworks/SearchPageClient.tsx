"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { getSearchedPosts, SearchedPosts } from "@/src/dal/posts";
import { SortByBox } from "@/src/components/ComboBox";
import { SelectMediums, SelectTags } from "@/src/components/PostComponents";
import { PostMedium } from "@/src/lib/generated/prisma/enums";
import PostsView from "@/src/components/post/PostsView";
import { Dispatch, SetStateAction } from "react";

export function SearchPageClient({ initialPosts }: { initialPosts: SearchedPosts }) {
  const [keyword, setKeyword] = useQueryState("keyword", {
    defaultValue: "",
    throttleMs: 400, // built-in debounce
    shallow: false,  // triggers server re-render
  });
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "latest",
    shallow: false,
  });
  const [tags, setTags] = useQueryState("tags",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: false })
  );
  const [mediums, setMediums] = useQueryState("mediums",
    parseAsArrayOf(parseAsString).withDefault([]).withOptions({ shallow: false })
  );

 const { data: posts, isFetching } = useQuery({
  queryKey: ["posts", "search", keyword, sortBy, tags, mediums],
  queryFn: () => getSearchedPosts(tags, mediums as PostMedium[], sortBy, keyword),
  staleTime: 2 * 60 * 1000,
});

  return (
    <div className="bg-(--bg) w-full flex justify-center">
      <div className="w-[88%] p-3 flex flex-col gap-4">

        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Search for Artworks"
          className="p-2 bg-(--surface2) border rounded-sm border-border"
        />

        <SortByBox sortBy={sortBy} setSortBy={setSortBy} />

        <SelectTags selectedTags={tags} setSelectedTags={setTags} />

        <SelectMediums selectedMediums={mediums as PostMedium[]} setSelectedMediums={setMediums as Dispatch<SetStateAction<PostMedium[]>>} />

        {isFetching && <div className="opacity-50 pointer-events-none"><PostsView posts={posts ?? []} /></div>}
        {!isFetching && <PostsView posts={posts ?? []} />}

      </div>
    </div>
  );
}