"use client"

import { Dispatch, SetStateAction, useState } from "react"
import Cropper from "react-easy-crop"
import { Button } from "./ui/button"
import { croppedImage } from "@/src/utils/croppedImage"
import { toast } from "sonner"

type area = {
    x: number,
    y: number,
    width: number,
    height: number
}

type props = {
    avatar: File | null;
    setAvatar: Dispatch<SetStateAction<File | null>>;
    setOpenImageCrop: Dispatch<SetStateAction<boolean>>;
}

export default function ImageCropDialog({ setAvatar, avatar, setOpenImageCrop }: props) {
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
            if (!avatar) {
                throw new Error("avatar not found");
            }
            const blob = await croppedImage(URL.createObjectURL(avatar), croppedPixels);
            const file = new File(
                [blob],
                "avatar.png",
                { type: "image/png" }
            );
            setAvatar(file);
            setOpenImageCrop(false);
        } catch (error) {
            toast("Error while cropping profile picture")
        }

    }

    const handleCancel = () => {
        setAvatar(null);
        setOpenImageCrop(false);
    }

    return (
        <div className="flex flex-col gap-8 items-center fixed top-1/2 left-1/2 -translate-1/2 w-180 rounded-xl p-5 self z-9999 bg-black ">
            <div className="w-full h-100 relative rounded-lg overflow-hidden">
                {avatar && <Cropper
                    image={URL.createObjectURL(avatar)}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                    onZoomChange={onZoomChange}
                />}


            </div>
            <div className="flex gap-4">
                <Button type="button" variant={"outline"} onClick={handleCancel}>cancel</Button>
                <Button type="button" onClick={handleCrop}>proceed</Button>
            </div>
        </div>
    )
}