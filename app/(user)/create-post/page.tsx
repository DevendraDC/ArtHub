"use server"

import CreatePost from "./CreatePost";
import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
    const userSession = await getSession()
    if (!userSession) {
        redirect("/login")
    }
    return (
        <div>
            <CreatePost userSession={userSession} />
        </div>
    )
}