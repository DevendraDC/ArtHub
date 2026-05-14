"use server"

import { SessionType } from "@/data/dal/getUserSession"
import { BellIcon, PlusIcon, Search } from "lucide-react"
import Link from "next/link"
import { ProfileDropdown } from "./ProfileDropdown"
import Image from "next/image"
import { Button } from "../ui/button"
import NavbarTabs from "./NavbarTabs"
import { cloudinaryTransform } from "@/utils/cloudinaryTransform"

export default async function Navbar({ session }: { session: SessionType }) {
    return (
        <nav className="top-0 relative z-999 bg-white/7 backdrop-blur-2xl p-3 w-full flex items-center justify-between">
            <section className="flex-1 flex items-center text-xl ml-10 gap-15">
                <h1 className="font-sans font-bold text-blue-100/70">MER<span className="text-blue-600 border-b-2 border-blue-600 font-mono text-2xl tracking-wide font-extrabold">ART</span></h1>
                <NavbarTabs />
            </section>
            <section className="flex-1 flex justify-between items-center">
                <section className="flex-2 relative max-w-80">
                    <input placeholder="Search for artists" className="w-full rounded-2xl p-3 text-sm pl-12 pr-7 bg-white/7 placeholder:text-blue-100/50 focus:outline-0" />
                    <Search size={34} className="absolute rounded-full bg-black p-1 left-1 top-1/2 -translate-y-1/2 text-white/80" />
                </section>
                <NavAuth session={session} />
            </section>
        </nav>
    )
}


function NavAuth({ session }: { session: SessionType }) {
    if (!session) {
        return (
            <section className="flex gap-10 text-sm items-center mr-10">
                <Link href={"/login"}><button className="font-sans">Login</button></Link>
                <Link href={"/signup"}><button className="bg-blue-700 rounded-sm cursor-pointer p-1 px-3">Signup</button></Link>
            </section>
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
            <Link href={"/notifications"}><BellIcon size={20} /></Link>
            <ProfileDropdown username={session.user.username ?? ""}>
                <section className="flex gap-2 p-2 items-center hover:bg-white/5 rounded-lg">
                    {session.user.image && <Image src={cloudinaryTransform(
                        session.user.image,
                        "50",
                    )} width={40} height={40} className="object-cover rounded-full" alt="" />}
                    <div>
                        <div className="font-serif text-sm">{session.user.name}</div>
                        <div className="text-xs text-blue-200/42">{session.user.username}</div>
                    </div>
                </section>
            </ProfileDropdown>
        </div>)
    }
}