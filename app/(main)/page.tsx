"use server"

import { Suspense } from "react";
import HomePage from "./HomePage";
import { getSession } from "@/src/utils/getSession";
import { Spinner } from "@/components/ui/spinner";


export default async function Home() {
  const session = await getSession()
  return (
    <div className="bg-(--bg) flex justify-center">
      <div className="w-[95%] flex flex-col justify-center gap-10 p-5">
        <div className="text-2xl font-serif">Your Feed</div>
        <Suspense fallback={<Spinner className="scale-150 absolute left-1/2 top-1/2 -translate-1/2"/>}>
          <HomePage session={session}/>
        </Suspense>
      </div>
    </div>

  )
}