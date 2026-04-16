"use client"


import { Bell, Bookmark, Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarTabs() {
    const pathname = usePathname();
    const navTabs = [
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
            link: ""
        },
        {
            icon: <Bookmark size={15} />,
            name: "Collections",
            link: ""
        }
    ]

    return (
        <ul className="flex gap-15 text-sm items-center">
            {
                navTabs.map((op, index) => (
                    <li key={index} className={`hover:text-blue-600 hover:scale-108 hover:translate-y-1 transition-all duration-300 ${pathname === op.link && "text-blue-500"}`}>
                        <Link className="flex gap-1 items-center" href={op.link}>
                            <div>{op.icon}</div>
                            <div>{op.name}</div>
                        </Link>
                    </li>
                ))
            }
        </ul>
    )
}