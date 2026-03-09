

import { getSession } from "@/utils/getSession"
import { PlusIcon, Search } from "lucide-react"
import Link from "next/link"

export default async function Navbar() {
    const session = await getSession()
    const navOptions = [
        {
            name: "Home",
            link: "/"
        },
        {
            name: "Explore",
            link: "/"
        },
        {
            name: "Collections",
            link: "/"
        },
        {
            name: "Your Artworks",
            link: "/"
        }
    ]
    return (
        <div className="sticky top-0 z-50 bg-[var(--bg2)] backdrop-blur-2xl border-white/30 p-3 flex items-center gap-20">
            <div className="text-2xl font-serif ml-10">Art<span className="text-amber-500">hub</span></div>
            <div className="flex gap-40 items-center">
                <ul className="flex gap-20">
                    {
                        navOptions.map((op, index) => (
                            <li key={index} className="hover-col">
                                <Link className="active:text-amber-400" href={op.link}>{op.name}</Link>
                            </li>
                        ))
                    }
                </ul>
                <div className="relative w-80">
                    <input className="w-full rounded-2xl p-2 px-4 pr-10 bg-white/6 focus:outline-0 text-sm" />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover-col" />
                </div>

                <div className="flex items-center gap-10">
                    <Link href={"/create-post"} className="hover-col cursor-pointer"><PlusIcon className="inline" /> Post</Link>
                    <div className="flex gap-3 items-center text-sm">
                        {session?.user.image ? <img src={session?.user.image} className="w-10 h-10 object-cover rounded-full" alt="" /> : <svg viewBox="0 0 128 128" className="w-10 h-10">
                            <circle cx="64" cy="64" r="64" fill="#E5E7EB" />
                            <circle cx="64" cy="48" r="20" fill="#9CA3AF" />
                            <path d="M32 104c0-18 14-30 32-30s32 12 32 30" fill="#9CA3AF" />
                        </svg>}
                        <div className="text-amber-300">{session?.user.name}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}