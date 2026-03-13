"use server"

import { Suspense } from "react";
import HomePage from "./HomePage";
import { getSession } from "@/src/utils/getSession";


export default async function Home() {
  const session = await getSession()
  return (
    <div className="bg-(--bg) flex justify-center">
      <div className="w-[95%] flex flex-col justify-center gap-10 p-5">
        <div className="text-2xl font-serif">Your Feed</div>
        <Suspense fallback={<div>Loading.....</div>}>
          <HomePage session={session}/>
        </Suspense>
      </div>
    </div>

  )
}