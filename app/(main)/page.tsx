import { Suspense } from "react";
import { HomePageClient } from "./Homepage";

export default async function Page() {
    return (
        <Suspense>
            <HomePageClient />
        </Suspense>
    )
}

