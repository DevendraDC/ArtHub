"use server"

import { getUserSession } from "@/src/data/dal/getUserSession";
import Profile from "./Profile";

export default async function Page() {
  const session = await getUserSession();
  return (
    <div>
      <Profile user={user} />
    </div>
  )
}