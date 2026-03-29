import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Search } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchArtists } from "../SearchArtists";

const queryClient = new QueryClient()

export function SearchBarDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative max-w-80">
                    <input placeholder="Search" disabled className="w-full rounded-2xl p-2 text-xs pl-12 pr-7 bg-white/7 placeholder:text-blue-100/50 focus:outline-0 text-sm" />
                    <Search size={28} className="absolute rounded-full bg-black p-1 left-1 top-1/2 -translate-y-1/2 text-white/80" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full relative text-sm z-9999 bg-black text-blue-200/80">
                <Link href={'/search/artworks'}>
                    <DropdownMenuItem className="text-sm">Search for artworks</DropdownMenuItem>
                </Link>
                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Search for artists
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                        <QueryClientProvider client={queryClient}>
                            <SearchArtists />
                        </QueryClientProvider>
                    </DialogContent>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}