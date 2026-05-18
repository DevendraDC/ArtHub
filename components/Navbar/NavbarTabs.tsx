"use client"


import { Bookmark, Compass, Image } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarTabs() {
    const pathname = usePathname();
    const navTabs = [
        {
            icon: Compass,
            name: "Discover",
            link: "/"
        },
        // {
        //     icon: Bookmark,
        //     name: "Collections",
        //     link: ""
        // },
        {
            icon: Image,
            name: "Browse Artworks",
            link: "/browse-artworks"
        }
    ]

    return (
        <ul className="flex gap-12 text-sm font-sans items-center">
            {
                navTabs.map((op, index) => (
                    <Link key={index} className={`p-2 flex gap-1 items-center ${pathname === op.link ? "text-blue-600 border-b border-blue-600" : "hover:text-blue-600 transition-all duration-300"}`} href={op.link}>
                        <div><op.icon size={15} /></div>
                        <div>{op.name}</div>
                    </Link>
                ))
            }
        </ul>
    )
}