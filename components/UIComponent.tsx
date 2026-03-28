"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Bookmark, LogOut, Search, Settings, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/src/components/ui/dialog";
import { SearchArtists } from "./SearchArtists";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Post = {
    id: string;
    createdAt: Date;
    artImages: { url: string }[];
};

type Props = {
    posts: Post[];
};

const queryClient = new QueryClient()


export function UserBox({ image, username, name }: { image: string, username: string, name: string }) {
    return (
        <div className="flex gap-3 items-center text-sm hover:bg-(--surface2) p-3 rounded-lg cursor-pointer transition-all duration-300">
            {image ? <img src={image} className="w-10 h-10 object-cover rounded-full" alt="" /> : <svg viewBox="0 0 128 128" className="w-10 h-10">
                <circle cx="64" cy="64" r="64" fill="#E5E7EB" />
                <circle cx="64" cy="48" r="20" fill="#9CA3AF" />
                <path d="M32 104c0-18 14-30 32-30s32 12 32 30" fill="#9CA3AF" />
            </svg>}
            <div>
                <div className="font-serif">{name}</div>
                <div className="text-xs text-(--text-subtle)">{username}</div>
            </div>

        </div>
    )
}

export function ProfileDropdown({ children }: { children: React.ReactNode }) {
    const options = [
        { to: "/profile", icon: <User />, name: "Your Profile" },
        { to: "/profile", icon: <Bookmark />, name: "Your Collections" },
        { to: "/profile", icon: <Settings />, name: "Settings" },
        { to: "/profile", icon: <LogOut />, name: "Logout" },
    ]
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="relative z-9999 text-blue-200/80 bg-black flex flex-col gap-2 p-2">
                {options.map((op, i) => (
                    <Link key={i} href={op.to}>
                        <DropdownMenuItem>
                            {op.icon}
                            <div>{op.name}</div>
                        </DropdownMenuItem>
                    </Link>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export function SearchBarDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative max-w-80">
                    <input placeholder="Search" disabled className="w-full rounded-2xl p-2 text-xs pl-12 pr-7 bg-white/7 placeholder:text-blue-100/50 focus:outline-0 text-sm" />
                    <Search size={28} className="absolute rounded-full bg-black p-1 left-1 top-1/2 -translate-y-1/2 text-white/80" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full relative z-9999 bg-black text-blue-200/80">
                <Link href={'/search/artworks'}>
                    <DropdownMenuItem>Search for artworks</DropdownMenuItem>
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



function PostCard({ post }: { post: Post }) {
    const imageUrl = post.artImages[0]?.url;

    return (
        <Link href={`/post/${post.id}`}>
            <div className="group relative aspect-square overflow-hidden rounded-lg bg-white/5 border border-white/8 cursor-pointer">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 font-serif text-sm">
                        No image
                    </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                    <div className="text-xs text-white/60">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function ProfilePostsGrid({ posts = [] }: Props) {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-(--text-muted)">
                <div className="text-3xl">—</div>
                <div className="text-sm">No posts yet</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}