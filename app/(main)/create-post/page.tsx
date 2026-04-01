"use server"

import { getUserSession } from "@/src/data/dal/getUserSession";
import CreatePost from "./CreatePost";

export default async function Page() {
    const session = getUserSession();
    return (
        <div>
            <CreatePost session={session}/>
        </div>
    )
}