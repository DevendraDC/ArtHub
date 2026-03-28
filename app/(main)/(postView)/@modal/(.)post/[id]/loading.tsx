"use client"

import { X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ModalLoading(){
    const router = useRouter()
    return (
        <div className="bg-white/10 border-2 border-(--bl0)/15 rounded-3xl backdrop-blur-lg flex gap-5 absolute z-999 top-1/2 left-1/2 -translate-1/2 w-[75vw] h-[90vh] overflow-hidden">
            <div className="flex p-5 gap-10 flex-3 text-(--bl0)/90 cursor-pointer">
                <X size={30} className="bg-white/10 p-1 rounded-full" onClick={() => router.back()}/>
            </div>
        </div>
    )
}