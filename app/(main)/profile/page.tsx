"use server"

import { getUserSession } from "@/src/utils/getUserSession";
import Profile from "./Profile";

export default async function Page() {
  const session = await getUserSession()
  return (
    <div>
      <Profile userSession={session} />
    </div>
  )
}