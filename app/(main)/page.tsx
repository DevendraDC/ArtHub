"use server"

import { Suspense } from "react";
import HomePage from "./HomePage";
import { Spinner } from "@/components/ui/spinner";


export default async function Home() {
  return (
    <div className="bg-(--bg) flex justify-center">
      <div className="w-[90%] flex flex-col justify-center gap-10 p-5">
        <div>
          <div className="text-sm flex gap-3">
            <span className="text-amber-400">Home</span>
            <span className="text-white/60">&gt;</span>
            <span className="text-(--text-subtle)">Feed</span>
          </div>
        </div>
        <div className="text-3xl font-sans">Your Feed</div>
        <Suspense fallback={<Spinner className="scale-150 absolute left-1/2 top-1/2 -translate-1/2" />}>
          <HomePage />
        </Suspense>
      </div>
    </div>

  )
}