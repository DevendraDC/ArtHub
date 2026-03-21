"use server";

import ProfileSettings from "@/src/app/(main)/edit-profile/editProfile";
import { getUserSession } from "@/src/utils/getUserSession";
import { redirect } from "next/navigation";

export default async function Page() {
    const userSession = await getUserSession();
    if (!userSession) {
        redirect("/login")
    }
    return (
        <ProfileSettings userSession={userSession} />
    );
}
