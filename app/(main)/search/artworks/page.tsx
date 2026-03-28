"use server"

import { SearchPageClient } from "./SearchPageClient";
import { NuqsAdapter } from "nuqs/adapters/next/app";;

export default async function Page() {
  return (
    <NuqsAdapter>
      <SearchPageClient/>
    </NuqsAdapter>
  );
}