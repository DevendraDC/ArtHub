import { getUserSession } from "@/src/utils/getUserSession"
import { Bell, Bookmark, Compass, PlusIcon } from "lucide-react"
import Link from "next/link"
import { ProfileDropdown, SearchBarDropdown } from "./UIComponent"

export default async function Navbar() {
    const session = await getUserSession()
    const navOptions = [
        // {
        //     icon: <LayoutGrid size={18} />,
        //     name: "Feed",
        //     link: "/"
        // },
        {
            icon: <Compass size={15} />,
            name: "Explore",
            link: "/"
        },
        {
            icon: <Bell size={15} />,
            name: "Notifications",
            link: "/"
        },
        {
            icon: <Bookmark size={15} />,
            name: "Collections",
            link: "/"
        }
    ]
    return (
        <div className="bg-[#111111] border-2 border-blue-200/12 w-full backdrop-blur-lg rounded-xl flex items-center justify-around">
            <div className="flex items-center gap-10">
                {/* <div className="bg-gradient-to-r text-3xl flex flex-col font-semibold items-center font-serif ml-10 from-[#AFA9EC] via-[#7F77DD] to-[#3B8BD4] bg-clip-text text-transparent">
                    <div>ArtHub</div>
                    <div className="text-[8px] font-sans">create &middot; share &middot; inspire</div>
                </div> */}
                <div className="text-xl font-serif">Art<span className="text-blue-500 text-2xl">Hub</span></div>
                <ul className="flex gap-10 text-sm items-center">
                    {
                        navOptions.map((op, index) => (
                            <li key={index} className="hover:text-blue-600 hover:scale-108 hover:translate-y-1 transition-all duration-300 text-white">
                                <Link className="active:text-amber-300 flex gap-1 items-center" href={op.link}>
                                    <div>{op.icon}</div>
                                    <div>{op.name}</div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="flex gap-20 items-center">
                <SearchBarDropdown />

                <div className="flex items-center gap-10 mr-5">
                    <Link href={"/create-post"} className="hover-col cursor-pointer"><button className="bg-blue-700 py-1 px-2 text-sm text-blue-200 hover:shadow-[0px_0px_40px] transition-all duration-300 hover:shadow-blue-400/40 flex items-center rounded-sm"><PlusIcon className="inline w-4 h-4" /> Post</button></Link>
                    <ProfileDropdown>
                        <div className="flex gap-3 items-center text-sm hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-all duration-300">
                            {session?.user.image ? <img src={session?.user.image} className="w-10 h-10 object-cover rounded-full" alt="" /> : <svg viewBox="0 0 128 128" className="w-10 h-10">
                                <circle cx="64" cy="64" r="64" fill="#E5E7EB" />
                                <circle cx="64" cy="48" r="20" fill="#9CA3AF" />
                                <path d="M32 104c0-18 14-30 32-30s32 12 32 30" fill="#9CA3AF" />
                            </svg>}
                            <div>
                                <div className="font-serif">{session?.user.name}</div>
                                <div className="text-xs text-blue-200/42">{session?.user.username}</div>
                            </div>

                        </div>
                    </ProfileDropdown>
                </div>
            </div>
        </div>
    )
}