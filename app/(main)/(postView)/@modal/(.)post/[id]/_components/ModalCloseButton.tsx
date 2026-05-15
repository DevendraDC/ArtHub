"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ModalClose(){
    const router = useRouter();
    return (
        <X size={35} className="bg-white/5 backdrop-blur-lg p-1 cursor-pointer absolute top-4 z-999 left-6 rounded-full" onClick={() => router.back()} />
    )
}