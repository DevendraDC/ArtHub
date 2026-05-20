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
    const [debouncedValue] = useDebounce(keyword, 200);
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["searchArtists", debouncedValue],
        queryFn: async () => await getUsers(debouncedValue),
        staleTime: 2 * 60 * 1000,
        enabled: debouncedValue.trim().length > 0,
    });
    // useEffect(() => {
    //     if (isError) toast(error.message);
    // }, [isError, error]);
    return (
        <div className="dropdown">
            <div tabIndex={0} role="searchbox" className="relative">
                <div className="join">
                    <div className="bg-white/7 flex items-center rounded-l-2xl px-2">
                        <Search
                        size={34}
                        className="join-item rounded-full bg-black p-1 text-white/80"
                    />
                    </div>
                    <input
                        type="text"
                        placeholder="Search artists..."
                        className="w-70 join-item rounded-r-2xl p-3 text-sm bg-white/7 placeholder:text-blue-100/50 focus:outline-0"
                        value={keyword}
                        onChange={(e) => setkeyword(e.target.value)}
                    />
                </div>

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
