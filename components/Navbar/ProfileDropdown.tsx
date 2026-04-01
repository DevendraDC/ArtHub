"use client"

import { Bookmark, LogOut, Settings, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Link from "next/link"

export function ProfileDropdown({ children, sessionUserId }: { children: React.ReactNode, sessionUserId: string }) {
    const options = [
        { to: `/profile/${sessionUserId}`, icon: <User />, name: "Your Profile" },
        { to: "/profile", icon: <Bookmark />, name: "Your Collections" },
        { to: "/settings", icon: <Settings />, name: "Settings" },
        { to: "/profile", icon: <LogOut />, name: "Logout" },
    ]
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
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