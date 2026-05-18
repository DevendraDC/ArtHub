"use client";

import { Bookmark, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { cloudinaryTransform } from "@/utils/cloudinaryTransform"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/better-auth/auth-client";

export function ProfileDropdown({ image, name, username }: { image: string, name: string, username: string }) {
    const router = useRouter()
    const options = [
        { to: `/profile/${username}`, icon: User, name: "Your Profile" },
        { to: "/profile", icon: Bookmark, name: "Your Collections" },
        { to: "/settings", icon: Settings, name: "Settings" },
        // { to: "/profile", icon: LogOut, name: "Logout" },
    ]
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="flex gap-2 cursor-pointer p-2 items-center hover:bg-white/5 rounded-lg">
                <Image src={cloudinaryTransform(
                    image,
                    "50",
                )} width={40} height={40} className="object-cover rounded-full" alt="" />
                <div>
                    <div className="font-serif text-sm">{name}</div>
                    <div className="text-xs text-blue-200/42">{username}</div>
                </div>
            </div>
            <ul tabIndex={-1} className="dropdown-content menu bg-black/60 backdrop-blur-2xl rounded-box z-99 gap-3 text-sm -translate-x-20 w-52 p-2 shadow-sm">
                {options.map((op, i) => (
                    <li key={i}>
                        <Link href={op.to}>
                            <op.icon size={18} />
                            <div>{op.name}</div>
                        </Link>
                    </li>

                ))}
                <li>
                    <button onClick={async () => {
                        await authClient.signOut({
                            fetchOptions: {
                                onSuccess: () => {
                                    router.push("/login"); // redirect to login page
                                },
                            },
                        });
                    }}>
                        <LogOut size={18} />
                        LogOut
                    </button>
                </li>

            </ul>
        </div>
    )
}