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
        <div className="images flex bg-(--surface) flex-col gap-5 border border-border p-6 rounded-xl cursor-pointer">
            <div className="text-sm font-sans tracking-widest text-(--text-muted)">
                <span className="text-amber-400">&middot; </span>IMAGES
            </div>
            <div
                onClick={() => imagesUploadRef.current?.click()}
                className="flex flex-col items-center gap-1 bg-(--surface2) border-[1.5px] border-dashed border-(--border-hover) text-sm p-7 rounded-lg hover:bg-(--amber-glow) hover:border-(--amber) transition-all duration-300"
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
                <Upload className="bg-(--amber-light) text-(--amber) border border-(--amber-mid) rounded-lg p-3 w-10 h-10" />
                <div>Upload your artworks</div>
                <div className="text-sm text-white/40">
                    Drag & drop or{" "}
                    <span className="text-(--amber)">click to browse</span> &middot;
                    JPG, PNG, GIF up to 20MB
                </div>
            </div>
            <div className="text-xs text-(--text-subtle)">
                <span className="text-amber-500">{selectedImages.length} </span>/ 10
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