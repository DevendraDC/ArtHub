"use client";

import { useState } from "react";
import { toast } from "sonner";
import { postUpload } from "@/data/dal/Post/mutations";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "motion/react"
import { PostMedium } from "@/lib/generated/prisma/enums";
import { createPostSchemaClient, ZodFormErrors } from "@/validators/post";
import { uploadMultipleImages } from "@/lib/cloudinaryFunctions";
import PostImagesUpload from "./_components/ImagesUpload";
import PostOtherDetails from "./_components/OtherDetails";
import z from "zod";
import { SelectMediums } from "@/components/post/Mediums";
import { SelectTags } from "@/components/post/Tags";


export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedMediums, setSelectedMediums] = useState<PostMedium[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [errors, setErrors] = useState<ZodFormErrors | null>(null)

    const handlePublish = async () => {
        const toValidate = {
            title,
            images: selectedImages,
            mediums: selectedMediums,
            description
        }
        const validatedData = createPostSchemaClient.safeParse(toValidate);
        if (!validatedData.success) {
            setErrors(validatedData.error.flatten());
            return;
        }
        setIsPublishing(true);
        const { data, success } = await uploadMultipleImages(selectedImages);
        if (!success || !data) {
            toast.error("Failed to upload images to cloudinary");
            setIsPublishing(false);
            return;
        }
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        selectedTags.forEach(tag => formData.append("tags", tag));
        selectedMediums.forEach(med => formData.append("mediums", med));
        data.forEach(img => formData.append("images", img.secure_url));
        toast.success("Post published successfully");
        setIsPublishing(false);
        handleDiscard();
        postUpload(formData).then(({ isSuccess }) => {
            if (!isSuccess) {
                toast.error("something went wrong while publishing the post")
            }
        });

    };

    const handleDiscard = () => {
        setTitle("");
        setDescription("");
        setSelectedImages([]);
        setSelectedMediums([]);
        setSelectedTags([]);
    }

    return (
        <div>
            <motion.div className="w-full flex justify-center p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}>
                <div className="w-[58%] flex flex-col gap-7 py-2">
                    <div className="flex flex-col gap-2">
                        <div className="font-sans text-4xl">Create a new <span className="text-blue-400">Post</span></div>
                        <div className="text-sm text-white/35">
                            share your artwork with the community
                        </div>
                    </div>

                    <PostImagesUpload selectedImages={selectedImages} setSelectedImages={setSelectedImages} />
                    {errors?.fieldErrors.images?.[0] && (
                        <p className="text-red-500 text-sm">
                            {errors.fieldErrors.images[0]}
                        </p>
                    )}
                    <div className="details flex flex-col gap-8 p-8 rounded-xl">
                        <div className="text-sm flex flex-col gap-8">
                            <div className="flex flex-col gap-3">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    placeholder="Name your artwork...."
                                    value={title}
                                    name="title"
                                    onChange={e => setTitle(e.target.value)}
                                    className="input-box"
                                />
                                {errors?.fieldErrors.title?.[0] && (
                                    <p className="text-red-500 text-sm">
                                        {errors.fieldErrors.title[0]}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <label
                                    htmlFor="description"
                                    className="flex justify-between"
                                >
                                    Description
                                    <span className="text-xs">
                                        {description.length} / 500
                                    </span>
                                </label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onInput={(e) => {
                                        const el = e.currentTarget;
                                        el.style.height = "auto";
                                        el.style.height = `${el.scrollHeight}px`;
                                    }}
                                    onChange={e => setDescription(e.target.value)}
                                    maxLength={500}
                                    placeholder="Tell the story behind this piece....."
                                    className="input-box p-4"
                                />
                                {errors?.fieldErrors.description?.[0] && (
                                    <p className="text-red-500 text-sm">
                                        {errors.fieldErrors.description[0]}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="text-sm">
                                    Medium
                                </div>
                                <SelectMediums mediumsController={{
                                    value: selectedMediums,
                                    setValue: setSelectedMediums
                                }} />
                                {errors?.fieldErrors.mediums?.[0] && (
                                    <p className="text-red-500 text-sm">
                                        {errors.fieldErrors.mediums[0]}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-3">
                                <label htmlFor="tags" className="text-sm">
                                    Tags
                                </label>
                                <SelectTags tagsController={{
                                    value: selectedTags,
                                    setValue: setSelectedTags
                                }} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-7 bg-transparent p-5 rounded-xl">
                        <button disabled={isPublishing} onClick={handleDiscard} className="py-2 flex-2 px-4 border-2 border-blue-100/15 text-white/60 rounded-sm hover:border-red-700 hover:text-red-700 hover:bg-red-500/10 transition-colors duration-300">
                            Discard
                        </button>
                        <button disabled={isPublishing} onClick={handlePublish} className="py-2 px-4 flex-3 border text-center bg-blue-400 flex justify-center items-center font-sans font-semibold text-black rounded-lg hover:shadow-[0_0_30px] hover:shadow-blue-400/50 transition-all duration-300">
                            {isPublishing ? <Spinner fontSize={20} /> : "Publish Post"}
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}
