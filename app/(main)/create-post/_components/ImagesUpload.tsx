import { Upload } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";


type props = {
    selectedImages: File[];
    setSelectedImages: Dispatch<SetStateAction<File[]>>;
}

export default function PostImagesUpload({ selectedImages, setSelectedImages }: props) {
    const imagesUploadRef = useRef<HTMLInputElement>(null);
    return (
        <div className="images flex flex-col gap-5 border-2 border-white/15 p-6 rounded-xl cursor-pointer">
            <div className="font-sans text-blue-200">
                <span className="text-blue-500">&middot; </span>IMAGES
            </div>
            <div
                onClick={() => imagesUploadRef.current?.click()}
                className="flex flex-col items-center gap-1 border-2 text-sm p-7 rounded-lg hover:bg-blue-400/10 hover:border-(--bl2) transition-all duration-300"
            >
                <input
                    type="file"
                    ref={imagesUploadRef}
                    onChange={(e) => {
                        if (selectedImages.length >= 10) {
                            toast("Cannot add more than 10 images");
                            return;
                        }
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setSelectedImages((prev) => [...new Set([...prev, file])]);
                    }}
                    name="uploadImages"
                    className="absolute -translate-x-999"
                    id=""
                />
                <Upload className="bg-blue-700 text-(--amber) rounded-lg p-3 w-10 h-10" />
                <div>Upload your artworks</div>
                <div className="text-sm text-blue-200/60">
                    Drag & drop or{" "}
                    <span className="text-(--amber)">click to browse</span> &middot;
                    JPG, PNG, GIF up to 20MB
                </div>
            </div>
            <div className="text-xs text-blue-100/40">
                <span className="text-blue-500">{selectedImages.length} </span>/ 10
                images &middot; first image is the cover &middot; Click on an image
                to remove it
            </div>
            {selectedImages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {selectedImages.map((img, i) => (
                        <motion.div
                            key={i}
                            className="relative cursor-pointer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => {
                                setSelectedImages((prev) =>
                                    prev.filter((prevImg) => prevImg !== img),
                                );
                            }}
                        >
                            <img
                                src={URL.createObjectURL(img)}
                                className="w-50 h-50 rounded-lg object-cover"
                            />
                            {i === 0 && (
                                <div className="bg-amber-600 rounded-sm p-1 px-2 font-bold text-xs absolute top-3 left-3">
                                    Cover
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
            { }
        </div>
    )
}