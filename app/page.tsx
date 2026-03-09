"use server"

import { getSession } from "@/utils/getSession";
import { redirect } from "next/navigation";


export default async function Home() {
  const userSession = await getSession(); 
  if(!userSession){
    redirect("/login")
  }
  if(!userSession.user.name){
    redirect("/settings")
  }
  return (
    <div>home</div>
  )
}