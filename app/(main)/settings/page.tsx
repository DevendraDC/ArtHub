"use server";

import ProfileSettings from "@/src/app/(main)/settings/settings";
import { getUserSession } from "@/src/data/dal/getUserSession";
import { getProfileSettingsData } from "@/src/data/dal/User/queries";

export default async function Page() {
    const data = await getProfileSettingsData()
    return (
        <ProfileSettings profileData={data} />
    );
}
