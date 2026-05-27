import { getUserSession } from "@/data/dal/getUserSession";
import { redirect } from "next/navigation";
import CreatePost from "./postCreationForm";

export default async function page() {
    const session = await getUserSession();
    if (!session) {
        redirect("/login")
    }
    else if (!session.user.name || !session.user.username) {
        redirect("/settings")
    }
    else {
        return (
            <CreatePost session={session}/>
        )
    }
}