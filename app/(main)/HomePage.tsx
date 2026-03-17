"use server"

import { getPosts } from "@/src/dal/posts"
import HomePageClient from "./HomePageClient";
import { Session } from "@/src/utils/getSession";

export default async function HomePage({session} : {session : Session}) {
    const posts = await getPosts();
    return (
        <HomePageClient posts={posts} />
    )
}