"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { getUsers } from "@/data/dal/User/queriesActions";
import { UserBox } from "./Navbar/UIComponent";
import { toast } from "sonner";
import { Search } from "lucide-react";

export function SearchArtists() {
    const [keyword, setkeyword] = useState("");
    const [debouncedValue] = useDebounce(keyword, 400);
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["searchArtists", debouncedValue],
        queryFn: async () => await getUsers(debouncedValue),
        staleTime: 2 * 60 * 1000,
        enabled: debouncedValue.trim().length > 0,
    });
    useEffect(() => {
        if (isError) toast(error.message);
    }, [isError, error]);
    return (
        // <main className="flex flex-col relative">
        //     <section className="relative">
        //         <input type="text" placeholder="Search artists..." className="w-full rounded-2xl p-3 text-sm pl-12 pr-7 bg-white/7 placeholder:text-blue-100/50 focus:outline-0" value={keyword} onChange={e => setkeyword(e.target.value)} />
        //         <Search size={34} className="absolute rounded-full bg-black p-1 left-1 top-1/2 -translate-y-1/2 text-white/80" />
        //     </section>
        //     {data && (
        //         <section className="bg-black min-h-50 p-2 absolute w-full top-12 rounded-lg">
        //             {data?.length === 0 && (
        //                 <p className="text-xl text-center mt-15 text-muted-foreground">No artists found....</p>
        //             )}
        //             {data.length > 0 && (
        //                 <div>
        //                     {data.map(d => (
        //                         <UserBox key={d.id} image={d.image ?? ""} name={d.name ?? ""} username={d.username ?? ""} />
        //                     ))}
        //                 </div>
        //             )}
        //         </section>
        //     )}

        // </main>
        <div className="dropdown">
            <div tabIndex={0} role="searchbox" className="relative">
                <input
                    type="text"
                    placeholder="Search artists..."
                    className="w-80 rounded-2xl p-3 text-sm pl-12 pr-7 bg-white/7 placeholder:text-blue-100/50 focus:outline-0"
                    value={keyword}
                    onChange={(e) => setkeyword(e.target.value)}
                />
                <Search
                    size={34}
                    className="absolute rounded-full bg-black p-1 left-1 top-1/2 -translate-y-1/2 text-white/80"
                />
            </div>
            {data && (
                <ul
                    tabIndex={-1}
                    className="dropdown-content menu rounded-box z-1 backdrop-blur-2xl bg-black/40 w-full p-2"
                >
                    {data.map(d => (
                        <UserBox key={d.id} image={d.image ?? ""} name={d.name ?? ""} username={d.username ?? ""} />
                    ))}
                </ul>
            )}

        </div>
    );
}
