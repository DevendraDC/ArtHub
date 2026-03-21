import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bookmark, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export default function ProfileDropdown({ children }: { children: React.ReactNode }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="relative z-9999 bg-black flex flex-col gap-2 p-2 border-white/30">
                <Link href={"/profile"}>
                    <DropdownMenuItem>
                        <User></User>
                        <div>Your Profile</div>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <Bookmark />
                    <div>Your Collections</div>
                </DropdownMenuItem>
                <Link href={"/profile-settings"}>
                <DropdownMenuItem>
                    <Settings />
                    <div>Settings</div>
                </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                    <LogOut />
                    <div>Logout</div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}