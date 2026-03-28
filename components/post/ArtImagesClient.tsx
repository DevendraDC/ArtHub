"use client"

import { cloudinaryTransform } from "@/src/utils/cloudinaryTransform";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react"

interface Props {
    images: {
        id: string;
        url: string;
    }[]
}

export default function ArtImagesClient({ images }: Props) {
    const [displayImage, setDisplayImage] = useState(images[0]);

    return (
        <div className="flex flex-col gap-8 pt-2 w-full">
            <motion.div
                key={displayImage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex justify-center items-center"
            >
                <Image
                    src={cloudinaryTransform(displayImage.url, "f_auto,q_auto,w_1500,c_limit")}
                    alt=""
                    height={1000}
                    width={1000}
                    loading="lazy"
                    className="object-contain h-136 rounded-lg"
                />
            </motion.div>

            <div className="flex gap-5 w-full">
                {images.map(img => (
                    <div key={img.id} className="cursor-pointer" onClick={() => setDisplayImage(img)}>
                        <Image
                            src={cloudinaryTransform(img.url, "f_auto,q_auto,w_1000,c_limit")}
                            alt=""
                            width={500}
                            height={500}
                            loading="lazy"
                            className={`h-15 w-15 object-cover rounded-lg transition-all ${displayImage.id === img.id
                                ? "border border-amber-400 opacity-100"
                                : "opacity-60 hover:opacity-100"
                                }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}