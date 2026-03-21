"use server"

import { getUserSession } from "@/src/utils/getUserSession";
import { redirect } from "next/navigation";
import Profile from "./Profile";

export default async function Page() {
  const userSession = await getUserSession();
  if (!userSession) {
    redirect("/login")
  }
  if (!userSession.user.name) {
    redirect("/settings")
  }
  return (
    <div>
      <Profile userSession={userSession} />
    </div>
  )
}