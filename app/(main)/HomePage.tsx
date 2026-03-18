"use server"

import { getPosts } from "@/src/dal/posts"
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
    const posts = await getPosts();
    return (
        <HomePageClient posts={posts} />
    )
}