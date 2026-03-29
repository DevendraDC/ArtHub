"use client"

import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function PostModal(
    { images, details }: { images: React.ReactNode, details: React.ReactNode }
) {
    const router = useRouter()
    return (
        <motion.div className="bg-white/10 border-2 border-(--bl0)/15 rounded-3xl backdrop-blur-lg flex gap-5 absolute z-999 top-1/2 left-1/2 -translate-1/2 w-[75vw] h-[90vh] overflow-hidden"
            initial={{ opacity: 0, y: 10, }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}>
            <div className="flex p-5 gap-10 flex-7 text-(--bl0)/90 cursor-pointer">
                <X size={30} className="bg-white/10 p-1 rounded-full" onClick={() => router.back()} />
                {images}
            </div>
            <div className="flex-3 min-h-full">
                {details}
            </div>
        </motion.div>
    )
}