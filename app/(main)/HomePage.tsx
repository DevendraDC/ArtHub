"use server"

import { getPosts, Posts } from "@/src/dal/posts"
import HomePagePosts from "./HomePagePosts"

export default async function HomePage({posts} : {posts : Posts | null}) {
    return (
        <HomePagePosts posts={posts !== null ? posts : await getPosts(0)} />
    )
}