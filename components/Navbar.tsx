

import { getUserSession } from "@/src/utils/getUserSession"
import { Bell, Bookmark, Compass, LayoutGrid, PlusIcon, Search } from "lucide-react"
import Link from "next/link"

export default async function Navbar() {
    const session = await getUserSession()
    const navOptions = [
        {
            icon: <LayoutGrid size={18} />,
            name: "Feed",
            link: "/"
        },
        {
            icon: <Compass size={18} />,
            name: "Explore",
            link: "/"
        },
        {
            icon: <Bell size={18} />,
            name: "Notifications",
            link: "/"
        },
        {
            icon: <Bookmark size={18} />,
            name: "Collections",
            link: "/"
        }
    ]
    return (
        <div className="sticky top-0 z-999 w-full bg-(--bg2) backdrop-blur-2xl border-white/30 p-3 flex items-center gap-16 inset-0">
            <div className="text-2xl font-serif ml-10">Art<span className="text-amber-500">hub</span></div>
            <div className="flex gap-40 items-center">
                <ul className="flex gap-20">
                    {
                        navOptions.map((op, index) => (
                            <li key={index} className="hover-col text-(--text-light)">
                                <Link className="active:text-amber-300 flex gap-1 items-center" href={op.link}>
                                    <div>{op.icon}</div>
                                    <div>{op.name}</div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
                <div className="relative max-w-80">
                    <input className="w-full rounded-2xl p-2 px-4 pr-10 bg-white/6 focus:outline-0 text-sm" />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover-col" />
                </div>

                <div className="flex items-center gap-10">
                    <Link href={"/create-post"} className="hover-col cursor-pointer"><button className="bg-amber-400 py-1 px-2 text-sm text-black hover:shadow-[0px_0px_8px] transition-all duration-300 hover:shadow-amber-300 flex items-center font-semibold rounded-sm"><PlusIcon className="inline w-4 h-4" /> Post</button></Link>
                    <div className="flex gap-3 items-center text-sm hover:bg-(--surface2) p-3 rounded-lg cursor-pointer transition-all duration-300">
                        {session?.user.image ? <img src={session?.user.image} className="w-10 h-10 object-cover rounded-full" alt="" /> : <svg viewBox="0 0 128 128" className="w-10 h-10">
                            <circle cx="64" cy="64" r="64" fill="#E5E7EB" />
                            <circle cx="64" cy="48" r="20" fill="#9CA3AF" />
                            <path d="M32 104c0-18 14-30 32-30s32 12 32 30" fill="#9CA3AF" />
                        </svg>}
                        <div>
                            <div className="font-serif">{session?.user.name}</div>
                            <div className="text-xs text-(--text-subtle)">{session?.user.username}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}