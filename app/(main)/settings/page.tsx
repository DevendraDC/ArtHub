import { getUserSession } from "@/data/dal/getUserSession";
import { redirect } from "next/navigation";
import Settings from "./Settings";

export default async function Page(){
    const session = await getUserSession();
    if(!session) {
        redirect("/login");
    }
    return (
        <Settings session={session}/>
    )
}