"use client";

import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { getSearchedPosts } from "@/data/dal/Post/queriesActions";
import { Mediums, SelectMediums } from "@/components/post/Mediums";
import { SelectTags } from "@/components/post/Tags";
import { PostMedium } from "@/lib/generated/prisma/enums";
import PostsView from "@/components/post/PostsView";
import { Dispatch, SetStateAction } from "react";
import { ArrowBigDown, BoxSelect, ChevronDown, Search } from "lucide-react";

export default function BrowseArtworks() {
  const [keyword, setKeyword] = useQueryState("keyword", {
    defaultValue: "",
    throttleMs: 400,
    shallow: false,
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
    staleTime: 10 * 60 * 1000,
  });

  return (
    <main className="w-[85%] p-3 mx-auto flex flex-col items-center gap-10">
      <section className="flex items-center gap-10">
        <section className="join z-10 mx-auto h-12">
          <div className="join-item px-3 bg-white/10 rounded-l-lg flex justify-center items-center">
            <Search />
          </div>
          <div className="w-80 h-full">
            <div className="h-full">
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Search for Artworks"
                className="p-2 pl-5 h-full w-full join-item focus:outline-0 flex-2 bg-white/6 placeholder:text-blue-100/35 font-light"
              />
            </div>
          </div>
          <select onChange={(e) => setSortBy(e.target.value)} className="select h-full w-30 rounded-r-lg join-item focus:outline-0 bg-white/15">
            <option>Latest</option>
            <option>Popular</option>
          </select>
        </section>
        <div className="dropdown text-sm">
          <button className="bg-white/10 p-3 px-5 rounded-sm flex items-center gap-7"><span>Select Mediums</span> <ChevronDown /></button>
          <ul className="dropdown-content list bg-white/10 backdrop-blur-2xl rounded-box z-99 h-80 overflow-auto w-52">
            {Mediums.map((med) => (
              <li className="list-row" key={med.label}>
                <label htmlFor={med.value} className="label text-white">
                  <input type="checkbox" name={med.value} id={med.value} checked={mediums.includes(med.value)} onChange={(e) => {
                    if (e.target.checked) {
                      setMediums((prev) => [...prev, med.value]);
                    } else {
                      setMediums((prev) =>
                        prev.filter((t) => t !== med.value)
                      );
                    }
                  }} className="checkbox shadow-none mr-2 bg-white/10" />
                  {med.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

      </section>

      <section className="w-[40%] ml-5 self-start gap-10 bg-transparent rounded-lg">
        <div className="flex flex-1 p-4 flex-col gap-5">
          {/* <h1 className="text-blue-100/80">Select Tags</h1> */}
          <SelectTags tagsController={{
            value: tags,
            setValue: setTags
          }} />
        </div>

      </section>

      <PostsView posts={posts ?? []} className="grid-cols-5" />
      {isFetching && (<div className="loading loading-dots text-primary scale-150"></div>)}
      {posts?.length === 0 && (<h1 className="text-blue-200/70">No Posts Found.....</h1>)}
    </main>
  );
}