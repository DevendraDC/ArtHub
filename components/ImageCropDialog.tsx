"use client"

import { Dispatch, SetStateAction, useState } from "react"
import Cropper from "react-easy-crop"
import { Button } from "./ui/button"
import { croppedImage } from "@/src/utils/croppedImage"
import { toast } from "sonner"

interface area {
    x: number,
    y: number,
    width: number,
    height: number
}

interface props {
    avatar: string,
    setPreview: Dispatch<SetStateAction<string | null>>,
    setAvatar: Dispatch<SetStateAction<string | null>>,
    setCurAvatar : Dispatch<SetStateAction<File | null>>
}

export default function ImageCropDialog({ avatar, setPreview, setAvatar, setCurAvatar }: props) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedPixels, setCroppedPixels] = useState<area | null>(null)

    const onCropChange = (crop: { x: number, y: number }) => {
        setCrop(crop)
    }

    const onCropComplete = (croppedArea: area, croppedAreaPixels: area) => {
        setCroppedPixels(croppedAreaPixels)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const handleCrop = async (e: any) => {
        e.preventDefault()
        try {
            if (!croppedPixels) {
                throw new Error("croppedPixels not found")
            }
            const blob = await croppedImage(avatar, croppedPixels);
            const file = new File(
                [blob],
                "avatar.png",
                { type: "image/png" }
            );
            setPreview(URL.createObjectURL(file));
            setCurAvatar(file)
            setAvatar(null)
        } catch (error) {
            toast("Error while cropping profile picture")
        }

    }

    return (
        <div className="flex flex-col gap-8 items-center">
            <div className="w-full h-100 relative rounded-lg overflow-hidden">
                <Cropper
                    image={avatar}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onZoomChange={onZoomChange}
                />

            </div>
            <div className="flex gap-4">
                <Button type="button" variant={"outline"} onClick={() => setAvatar(null)}>cancel</Button>
                <Button type="button" onClick={handleCrop}>proceed</Button>
            </div>
        </div>
    )
}