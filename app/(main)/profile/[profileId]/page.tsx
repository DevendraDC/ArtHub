"use server"

import Profile from "./Profile";
import { getUser } from "@/src/data/dal/User/queries";

export default async function Page({params}: {params: Promise<{profileId: string}>}) {
  const {profileId} = await params;
  const user = await getUser(profileId);
  if(!user.success || !user.userData){
    return <div>profile not found....</div>
  }
  return (
    <div>
      <Profile user={user} />
    </div>
  )
}