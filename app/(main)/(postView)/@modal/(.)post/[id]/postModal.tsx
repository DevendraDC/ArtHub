"use client"

import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function PostModal(
    { images, details }: { images: React.ReactNode, details: React.ReactNode }
) {
    const router = useRouter()
    return (
        <motion.div className="bg-white/10 border-2 border-blue-100/15 rounded-3xl backdrop-blur-lg flex absolute z-999 top-1/2 left-1/2 -translate-1/2 w-[90vw] h-[90vh] overflow-hidden"
            initial={{ opacity: 0, y: 10, }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex gap-10 flex-6 text-(--bl0)/90 cursor-pointer">
                <X size={35} className="bg-white/15 p-1 absolute top-4 z-999 left-6 rounded-full" onClick={() => router.back()} />
                {images}
            </div>
            <div className="flex-2 min-h-full">               
                {details}
            </div>
        </motion.div>
    )
}