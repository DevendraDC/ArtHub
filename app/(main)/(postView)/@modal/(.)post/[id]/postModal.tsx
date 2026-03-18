"use client"

import { useRouter } from "next/navigation"

export default function PostModal(
    { children }: { children: React.ReactNode }
) {
    const router = useRouter()
    return (
        <div className="bg-(--bg)/40 backdrop-blur-lg flex p-5 px-10 flex-col gap-8 absolute z-999 inset-0 overflow-hidden">
            <div className="flex gap-2 w-full text-(--text-light) cursor-pointer shrink-0" onClick={() => router.back()}>
                &larr;
                <div>Back to Feed</div>
            </div>
            <div className="flex-1 min-h-0 p-3">
                {children}
            </div>
        </div>

    )
}