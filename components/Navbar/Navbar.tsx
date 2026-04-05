"use server"

import { getUserSession, SessionType } from "@/data/dal/getUserSession"
import { Bell, Bookmark, Compass, PlusIcon } from "lucide-react"
import Link from "next/link"
import { ProfileDropdown } from "./ProfileDropdown"
import { SearchBarDropdown } from "./SearchBarDropdown"
import Image from "next/image"
import { UserSession } from "@/data/dto/userdto"
import { Button } from "../ui/button"

export default async function Navbar({ session }: { session: SessionType }) {
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
        <div className="bg-[#111111] border-2 border-blue-200/12 p-2 w-full backdrop-blur-lg rounded-xl flex items-center justify-around">
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
                <NavAuth session={session} />

            </div>
        </div>
    )
}


function NavAuth({ session }: { session: SessionType }) {
    if (!session) {
        return (
            <div className="flex gap-4 text-sm ">
                <Link href={"/login"}><button className="bg-white cursor-pointer rounded-lg p-1 px-2 font-semibold text-black">Login</button></Link>
                <Link href={"/signup"}><button className="bg-blue-700 cursor-pointer p-1 px-2 rounded-lg">Signup</button></Link>
            </div>
        )
    }
    else if (session && (!session.user.username || !session.user.name)) {
        return (
            <Link href={"/settings"}><Button className="text-sm">Setup Profile</Button></Link>
        )
    }
    else {

        return (<div className="flex items-center gap-10 mr-5">
            <Link href={"/create-post"} className="hover-col cursor-pointer"><button className="bg-blue-700 py-1 px-2 text-sm text-blue-200 hover:shadow-[0px_0px_40px] transition-all duration-300 hover:shadow-blue-400/40 flex items-center rounded-sm"><PlusIcon className="inline w-4 h-4" /> Post</button></Link>
            <ProfileDropdown username={session.user.username ?? ""}>
                <div className="flex gap-2 p-2 items-center hover:bg-white/5">
                    {session.user.image && <Image src={session.user.image} width={40} height={40} className="object-cover rounded-full" alt="" />}
                    <div>
                        <div className="font-serif text-sm">{session.user.name}</div>
                        <div className="text-xs text-blue-200/42">{session.user.username}</div>
                    </div>
                </div>
            </ProfileDropdown>
        </div>)
    }
}