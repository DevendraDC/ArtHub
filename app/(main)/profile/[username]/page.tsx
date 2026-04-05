"use server"

import Profile from "./Profile";
import { getProfile } from "@/data/dal/User/queries";

export default async function Page({params}: {params: Promise<{username: string}>}) {
  const {username} = await params;
  const user = await getProfile(username);
  if(!user.success || !user.userData){
    return <div>profile not found....</div>
  }
  return (
    <div>
      <Profile user={user} />
    </div>
  )
}