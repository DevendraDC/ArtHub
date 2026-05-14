"use server"

import { Suspense } from "react";
import { SearchPageClient } from "./SearchPageClient";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function Page() {
  return (
    <NuqsAdapter>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchPageClient />
      </Suspense>
    </NuqsAdapter>
  );
}