import { getUserSession, SessionType } from "@/data/dal/getUserSession"
import { BellIcon, PlusIcon } from "lucide-react"
import Link from "next/link"
import { ProfileDropdown } from "./ProfileDropdown"
import { Button } from "../ui/button"
import NavbarTabs from "./NavbarTabs"
import { SearchArtists } from "../SearchArtists"

export default async function Navbar() {
    const session = await getUserSession();
    return (
        <nav className="top-0 relative z-999 backdrop-blur-2xl p-3 w-full flex items-center justify-between">
            <section className="flex-1 flex items-center text-xl ml-10 gap-15">
                <h1 className="font-logo font-bold text-blue-100/70">ART<span className="text-blue-600 font-logo text-xl font-bold">HUB</span></h1>
                <NavbarTabs />
            </section>
            <section className="flex-1 flex justify-between items-center">
                <section className="flex-2 relative max-w-80">
                    {/* <input placeholder="Search for artists" className="w-full rounded-2xl p-3 text-sm pl-12 pr-7 bg-white/7 placeholder:text-blue-100/50 focus:outline-0" />
                    <Search size={34} className="absolute rounded-full bg-black p-1 left-1 top-1/2 -translate-y-1/2 text-white/80" /> */}
                    <SearchArtists />
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
                <Link href={"/login"}><button className="font-sans border rounded-sm">Login</button></Link>
                <Link href={"/signup"}><button className="bg-blue-700 rounded-sm cursor-pointer p-1 px-3">Signup</button></Link>
            </section>
        )
    }
    else if ((!session.user.username || !session.user.name)) {
        return (
            <Link href={"/settings"}><Button className="text-sm">Setup Profile</Button></Link>
        )
    }
    else {

        return (<div className="flex items-center gap-10 mr-5">
            <Link href={"/create-post"} className="hover-col cursor-pointer"><button className="bg-blue-700 py-1 px-2 text-sm text-blue-200 hover:shadow-[0px_0px_40px] transition-all cursor-pointer duration-300 hover:shadow-blue-400/40 flex items-center rounded-sm"><PlusIcon className="inline w-4 h-4" /> Post</button></Link>
            {/* <Link href={"/notifications"}><BellIcon size={20} /></Link> */}
            <ProfileDropdown name={session.user.name} image={session.user.image ?? ""} username={session.user.username ?? ""} />
        </div>)
    }
}