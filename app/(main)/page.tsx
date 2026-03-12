"use server"

import { getPosts } from "@/src/dal/posts";
import { getSession } from "@/src/utils/getSession";
import { redirect } from "next/navigation";
import HomePage from "./HomePage";


export default async function Home() {
  const userSession = await getSession();
  if (!userSession) {
    redirect("/login")
  }
  if (!userSession.user.name) {
    redirect("/settings")
  }
  const posts = await getPosts(userSession.user.id);
  return (
    <HomePage userSession={userSession} posts={posts}/>
  )
}