"use client"

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { getUsers } from "../dal/user-queries";
import { UserBox } from "./Navbar/UIComponent";
import { toast } from "sonner";
import { DialogTitle } from "@/src/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";;

export function SearchArtists() {
    const [keyword, setkeyword] = useState("");
    const [debouncedValue] = useDebounce(keyword, 400);
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ["searchArtists", debouncedValue],
        queryFn: async () => await getUsers(debouncedValue),
        staleTime: 2 * 60 * 1000,
        enabled: debouncedValue.trim().length > 0
    })
    useEffect(() => {
        if (isError) toast(error.message);
    }, [isError, error]);
    return (
        <>
            <VisuallyHidden><DialogTitle>Search Artists</DialogTitle></VisuallyHidden>
            <input type="text" placeholder="Search artists..." className="w-full p-2 rounded focus:outline-0" value={keyword} onChange={e => setkeyword(e.target.value)} />
            {isLoading && (
                <p className="text-sm text-muted-foreground">Searching...</p>
            )}
            {data?.length === 0 && (
                <p className="text-sm text-muted-foreground">No artists found.</p>
            )}
            {data && data.length > 0 && (
                <div>
                    {data.map(d => (
                        <UserBox key={d.id} image={d.image ?? ""} name={d.name ?? ""} username={d.username ?? ""} />
                    ))}
                </div>
            )}
        </>
    )
}