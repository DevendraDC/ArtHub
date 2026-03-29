"use server";

import ProfileSettings from "@/src/app/(main)/settings/settings";
import { getUserSession } from "@/src/data/dal/getUserSession";
import { getProfileSettingsData } from "@/src/data/dal/User/queries";

export default async function Page() {
    const userSession = await getUserSession();
    if(!userSession || !userSession.userId) return <div>session not found...</div>
    const details = await getProfileSettingsData(userSession.userId)
    return (
        <ProfileSettings data={{
            userSession,
            details
        }} />
    );
}
