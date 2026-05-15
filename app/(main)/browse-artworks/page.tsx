import { Suspense } from "react";
import { SearchPageClient } from "./SearchPageClient";

export default async function Page() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageClient />
      </Suspense>
  );
}