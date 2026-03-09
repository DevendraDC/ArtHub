"use server";

import ProfileSettings from "@/components/profile/Settings";
import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";

export default async function Page() {
    const userSession = await getSession();
    if (!userSession) {
        redirect("/login")
    }
    return (
        <ProfileSettings userSession={userSession} />
    );
}
