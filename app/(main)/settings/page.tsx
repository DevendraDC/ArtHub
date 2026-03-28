"use server";

import ProfileSettings from "@/src/app/(main)/settings/settings";
import { getUserSession } from "@/src/utils/getUserSession";
import { redirect } from "next/navigation";

export default async function Page() {
    const userSession = await getUserSession();
    return (
        <ProfileSettings userSession={userSession} />
    );
}
