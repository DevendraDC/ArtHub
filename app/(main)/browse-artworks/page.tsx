import { Suspense } from "react";
import BrowseArtworks from "./BrowseArtworks";

export default function Page() {
    return (
        <Suspense>
            <BrowseArtworks />
        </Suspense>

    )
}