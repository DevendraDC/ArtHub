"use server"

import { HomePageClient } from "./Homepage";

export default async function Page() {
    return (
        <div>
            <HomePageClient />
        </div>
    )
}

