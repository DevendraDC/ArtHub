"use server";

import ProfileSettings from "@/src/app/(main)/settings/settings";
import { getUserSession } from "@/src/dal/getUserSession";

export default async function Page() {
    const userSession = await getUserSession();
    return (
        <ProfileSettings userSession={userSession} />
    );
}
