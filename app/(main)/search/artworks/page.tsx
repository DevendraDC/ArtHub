import { SearchPageClient } from "./SearchPageClient";
import { getSearchedPosts } from "@/src/dal/posts";
import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function Page({ searchParams }: { searchParams: Record<string, string> }) {
  const keyword = searchParams.keyword ?? "";
  const sortBy = searchParams.sortBy ?? "latest";
  const tags = searchParams.tags ? searchParams.tags.split(",") : [];
  const mediums = searchParams.mediums ? searchParams.mediums.split(",") : [];

  const initialPosts = await getSearchedPosts(tags, mediums as PostMedium[], sortBy, keyword);

  return (
    <NuqsAdapter>
      <SearchPageClient initialPosts={initialPosts} />
    </NuqsAdapter>
  );
}