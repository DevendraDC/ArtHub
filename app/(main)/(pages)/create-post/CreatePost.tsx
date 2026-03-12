"use client";

import { Upload, X } from "lucide-react";
import { sessionType } from "@/src/app/(main)/(pages)/edit-profile/editProfile";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { uploadMultipleImages } from "@/src/utils/upload-to-cloudinary";
import { postUpload } from "@/src/dal/posts";
import { useRouter } from "next/navigation";

export default function CreatePost({
    userSession,
}: {
    userSession: sessionType;
}) {
    const router = useRouter()
    const [tagInputVal, setTagInputVal] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const imagesUploadRef = useRef<HTMLInputElement>(null);
    const [description, setDescription] = useState("");
    const [medium, setMedium] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const mediums = [
        { value: PostMedium.DIGITAL, label: "Digital" },
        { value: PostMedium.OIL_PAINT, label: "Oil Paint" },
        { value: PostMedium.WATERCOLOR, label: "Watercolor" },
        { value: PostMedium.PHOTOGRAPHY, label: "Photography" },
        { value: PostMedium.ILLUSTRATION, label: "Illustration" },
        { value: PostMedium.SCULPTURE, label: "Sculpture" },
        { value: PostMedium.MIXED_MEDIA, label: "Mixed Media" },
        { value: PostMedium.SKETCH, label: "Sketch" },
        { value: PostMedium.THREE_D, label: "3D" },
        { value: PostMedium.ANIMATION, label: "Animation" },
        { value: PostMedium.LINEART, label: "Lineart" },
        { value: PostMedium.CONCEPT_ART, label: "Concept Art" },
        { value: PostMedium.ANIME_ART, label: "Anime Art" },
        { value: PostMedium.MANGA_ART, label: "Manga Art" },
        { value: PostMedium.PIXEL_ART, label: "Pixel Art" },
        { value: PostMedium.TRADITIONAL_ART, label: "Traditional Art" },
        { value: PostMedium.OTHER, label: "Other" },
    ];
    const handlePublish = async (e: any) => {
        e.preventDefault();
        if (selectedImages.length === 0) {
            toast("please selected atleast one image");
            return;
        }
        if (medium.length === 0) {
            toast("please select atleast one art medium");
            return;
        }
        if (!title) {
            toast("the post must have a title")
            return;
        }
        setIsPublishing(true);
        const uploadedImages = await uploadMultipleImages(selectedImages)
        if (!uploadedImages) {
            toast("failed to upload images");
            setIsPublishing(false)
            return;
        }
        const formData = new FormData();
        formData.set("authorId", userSession.user.id)
        formData.set("title", title);
        formData.set("description", description);
        tags.forEach(tag => formData.append("tags", tag));
        medium.forEach(med => formData.append("mediums", med));
        uploadedImages.forEach(img => formData.append("images", img.secure_url));
        const { success, error } = await postUpload(formData);
        if (!success) {
            toast(error);
        }
        else {
            setIsPublishing(false)
            toast("Post published successfully");
            router.push("/")
        }
        setIsPublishing(false);
    };

    const handleDiscard = () => {
        setTitle("");
        setDescription("");
        setSelectedImages([]);
        setMedium([]);
        setTags([]);
        setTagInputVal("")
    }

    return (
        <div className="w-full flex justify-center p-5 bg-(--bg)">
            <div className="w-[55%] flex flex-col gap-7">
                <div>
                    <div className="text-sm flex gap-3">
                        <span className="text-amber-400">Home</span>
                        <span className="text-white/60">&gt;</span>
                        <span className="text-(--text-subtle)">create a Post</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="font-serif text-4xl">Create a new Post</div>
                    <div className="text-sm text-(--text-muted)">
                        share your artwork with the community
                    </div>
                </div>
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
                                if (selectedImages.length > 10) {
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
                </div>
                <div className="details bg-(--surface) flex flex-col gap-8 border border-border p-8 rounded-xl">
                    <div className="text-sm font-sans tracking-widest text-(--text-muted)">
                        <span className="text-amber-400">&middot; </span>DETAILS
                    </div>
                    <div className="text-sm flex flex-col gap-8">
                        <div className="flex flex-col gap-3">
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                placeholder="Name your artwork...."
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border placeholder:text-(--text-subtle) rounded-sm p-3 resize-none focus:outline-0 border-border bg-(--surface2)"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label
                                htmlFor="description"
                                className="flex justify-between font-sans text-(--text-light)"
                            >
                                Description
                                <span className="text-xs text-(--text-subtle)">
                                    {description.length} / 500
                                </span>
                            </label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onInput={(e) => {
                                    const el = e.currentTarget;
                                    el.style.height = "auto";
                                    el.style.height = `${el.scrollHeight}px`;
                                }}
                                maxLength={500}
                                placeholder="Tell the story behind this piece....."
                                className="border placeholder:text-(--text-subtle) rounded-sm p-4 resize-none focus:outline-0 border-border bg-(--surface2)"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="text-(--text-light) text-sm font-sans">
                                Medium
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {mediums.map((med) => (
                                    <div
                                        key={med.value}
                                        onClick={() => {
                                            if (!medium.includes(med.value)) {
                                                setMedium(prev => [...prev, med.value]);
                                            }
                                            else {
                                                const newMedium = medium.filter(m => m !== med.value)
                                                setMedium(newMedium);
                                            }
                                        }}
                                        className={`p-2 px-3 border transition-colors duration-300 text-sm rounded-lg cursor-pointer 
      ${medium.includes(med.value)
                                                ? "bg-(--amber-light) text-(--amber) border-(--amber)"
                                                : "text-(--text-muted) hover:text-white border-border"
                                            }`}
                                    >
                                        {med.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <label htmlFor="tags" className="font-sans text-(--text-light)">
                                Tags
                            </label>
                            <input
                                type="text"
                                name="tags"
                                id="tags"
                                value={tagInputVal}
                                onChange={(e) => {
                                    const cur = e.target.value;
                                    if (cur.endsWith(",")) {
                                        const curTag = cur.slice(0, -1);
                                        setTags((prev) => [...new Set([...prev, curTag])]);
                                        setTagInputVal("");
                                    } else setTagInputVal(cur);
                                }}
                                placeholder="Add the tags...."
                                className="border placeholder:text-(--text-subtle) w-full rounded-sm p-4 pr-20 resize-none focus:outline-none border-border bg-(--surface2)"
                            />
                            <div className="text-xs text-(--text-subtle)">
                                Enter comma to include a tag
                            </div>
                            {tags.length > 0 && (
                                <div className="flex gap-5">
                                    {tags.map((tag, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-(--amber-light) text-(--amber) border border-(--amber-mid) py-1 px-3 rounded-md relative"
                                        >
                                            {tag}{" "}
                                            <X
                                                onClick={() =>
                                                    setTags((prev) => prev.filter((cur) => cur !== tag))
                                                }
                                                className="absolute w-5 h-5 p-1 font-bold text-black bg-white rounded-full -top-1 -left-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-7 bg-(--surface) border border-border p-5 rounded-xl">
                    <button disabled={isPublishing} onClick={handleDiscard} className="py-2 px-4 border border-border text-(--text-muted) rounded-sm hover:border-(--border-hover) hover:text-(--text) hover:bg-(--surface2) transition-colors duration-300">
                        Discard
                    </button>
                    <button onClick={handlePublish} disabled={isPublishing} className="py-2 px-4 border bg-amber-400 font-sans font-semibold text-black w-full rounded-lg hover:bg-amber-300 hover:shadow-[0px_0px_5px] hover:shadow-amber-300 hover:-translate-y-1 transition-all duration-300">
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
    );
}
