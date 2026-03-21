import HomePageClient from "./HomePageClient";
import { getPosts } from "@/src/dal/posts";

export default async function Page() {
  const initialPosts = await getPosts(0);

  return <HomePageClient initialPosts={initialPosts} />;
}