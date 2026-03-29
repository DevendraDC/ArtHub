"use client";

import { useState } from "react";
import { toast } from "sonner";
import { postUpload } from "@/src/data/dal/Post/mutations";
import { useRouter } from "next/navigation";
import { Spinner } from "@/src/components/ui/spinner";
import { motion } from "motion/react"
import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { createPostSchemaClient, ZodTreeError } from "@/src/validators/post";
import { uploadMultipleImages } from "@/src/lib/cloudinaryFunctions";
import PostImagesUpload from "./_components/ImagesUpload";
import PostOtherDetails from "./_components/OtherDetails";
import z from "zod";


export default function CreatePost() {
    const router = useRouter()
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedMediums, setSelectedMediums] = useState<PostMedium[]>([]);
    const [isPublishing, setIsPublishing] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [errors, setErrors] = useState<ZodTreeError | null>(null)

    const handlePublish = async () => {
        console.log("hello")
        const toValidate = {
            title,
            images: selectedImages,
            mediums: selectedMediums,
            description
        }
        const validatedData = createPostSchemaClient.safeParse(toValidate);
        if (!validatedData.success) {
            console.log("hello")
            setErrors(z.treeifyError(validatedData.error));
            return;
        }
        setIsPublishing(true);
        setUploadingImages(true);
        const { data, success } = await uploadMultipleImages(selectedImages);
        if (!success || !data) {
            toast("Failed to upload images to cloudinary");
            setUploadingImages(false);
            setIsPublishing(false);
            return;
        }
        setUploadingImages(false);
        console.log(data);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        selectedTags.forEach(tag => formData.append("tags", tag));
        selectedMediums.forEach(med => formData.append("mediums", med));
        data.forEach(img => formData.append("images", img.secure_url));
        const { isSuccess, error, formError } = await postUpload(formData);
        if (!isSuccess) {
            if (formError) {
                setErrors(formError);
                toast("form errors")
            }
            if (error) toast(error)
            setIsPublishing(false);
            return;
        }
        toast("Post published successfully");
        setIsPublishing(false)
        router.push("/")
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
            {isPublishing ? (
                <div className="absolute left-1/2 top-1/2 -translate-1/2 flex items-center flex-col gap-5">
                    <Spinner width={50} height={50} className="scale-200" />
                    <div className="font-sans text-(--bl1) animate-pulse">
                        {uploadingImages ? "uploading images" : "publishing post"}.....
                    </div>
                </div>
            ) : (
                <motion.div className="w-full flex justify-center p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}>
                    <div className="w-[55%] flex flex-col gap-7 py-2">
                        <div className="flex flex-col gap-2">
                            <div className="font-sans text-4xl">Create a new <span className="text-blue-400">Post</span></div>
                            <div className="text-sm text-white/35">
                                share your artwork with the community
                            </div>
                        </div>

                        <PostImagesUpload selectedImages={selectedImages} setSelectedImages={setSelectedImages} />

                        <PostOtherDetails
                            titleController={{
                                value: title,
                                setValue: setTitle
                            }}
                            descriptionController={{
                                value: description,
                                setValue: setDescription
                            }}
                            tagsController={{
                                value: selectedTags,
                                setValue: setSelectedTags
                            }}
                            mediumsController={{
                                value: selectedMediums,
                                setValue: setSelectedMediums
                            }}
                        />
                        <div className="flex gap-7 bg-(--surface) border border-border p-5 rounded-xl">
                            <button disabled={isPublishing} onClick={handleDiscard} className="py-2 px-4 border border-border text-(--text-muted) rounded-sm hover:border-(--border-hover) hover:text-(--text) hover:bg-(--surface2) transition-colors duration-300">
                                Discard
                            </button>
                            <button disabled={isPublishing} onClick={handlePublish} className="py-2 px-4 border text-center bg-amber-400 flex justify-center items-center font-sans font-semibold text-black w-full rounded-lg hover:bg-amber-300 hover:shadow-[0px_0px_5px] hover:shadow-amber-300 hover:-translate-y-1 transition-all duration-300">
                                {isPublishing ? <Spinner /> : "Publish Post"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
