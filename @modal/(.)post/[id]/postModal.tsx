"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"

export default function PostModal(
    { children }: { children: React.ReactNode }
) {
    const router = useRouter()
    return (
        <div className="bg-(--bg) flex justify-center">
            <div className="w-[100%] flex p-25 flex-col h-[800px] gap-8 absolute z-99 top-1/2 left-1/2 -translate-1/2 inset-0">

                <div className="flex gap-2 text-(--text-muted) cursor-pointer"  onClick={() => router.back()}>
                    &larr;
                    <div>
                        Back to Feed
                    </div>
                </div>
                <Suspense>
                    {children}
                </Suspense>

            </div>
        </div>
    )
}