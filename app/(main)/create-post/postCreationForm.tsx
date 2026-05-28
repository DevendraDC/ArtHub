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
import { SelectMediums } from "@/components/post/Mediums";
import { SelectTags } from "@/components/post/Tags";
import Form from "next/form"
import { useRouter } from "next/navigation";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { SessionType } from "@/data/dal/getUserSession";
import { checkAi } from "@/utils/checkAi";
import { useFormStatus } from "react-dom";


export default function CreatePost({ session }: { session: SessionType }) {
    const queryClient = useQueryClient();
    const router = useRouter()
    const username = session?.user.username;
    const userId = session?.user.id;
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedMediums, setSelectedMediums] = useState<PostMedium[]>([]);
    const [errors, setErrors] = useState<ZodFormErrors | null>(null)

    const handlePublish = async (formData: FormData) => {
        const title = formData.get("title");
        const description = formData.get("description");

        const validatedData = createPostSchemaClient.safeParse({
            title,
            images: selectedImages,
            mediums: selectedMediums,
            description,
        });

        if (!validatedData.success) {
            setErrors(z.flattenError(validatedData.error));
            return;
        }

        try {
            const uploaded = await uploadMultipleImages(selectedImages);

            if (!uploaded.success || !uploaded.data) {
                toast.error("Failed to upload images");
                return;
            }

            const aiCheckPromises = uploaded.data.map(img => checkAi(img.secure_url));
            const aiCheckResults = await Promise.all(aiCheckPromises);

            const systemErrorOccurred = aiCheckResults.some(res => !res.success);
            const containsAiImage = aiCheckResults.some(res => res.success && res.result?.aiGenerated);


            if (systemErrorOccurred) {
                toast.error("An error occurred while scanning your images for AI content.");
                return;
            }

            if (containsAiImage) {
                toast.error("One or more images were flagged as AI-generated. Posts must be authentic human artwork.");
                return;
            }

            selectedTags.forEach((tag) => {
                formData.append("tags", tag);
            });

            selectedMediums.forEach((med) => {
                formData.append("mediums", med);
            });

            uploaded.data.forEach((img) => {
                formData.append("images", img.secure_url);
            });

            const result = await postUpload(formData);

            if (!result.success) {
                toast.error("Failed to publish post");
                return;
            }

            toast.success("Post published successfully");
            queryClient.invalidateQueries({
                queryKey: ["ProfilePage", 0, userId]
            })
            router.push(`/profile/${username}`);
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "failed to publish post");
        }
    };

    const handleDiscard = () => {
        setSelectedMediums([]);
        setSelectedTags([]);
        setSelectedImages([]);
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
                    <Form action={handlePublish}>
                        <div className="details flex flex-col gap-8 p-8 rounded-xl">
                            <div className="text-sm flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Name your artwork...."
                                        name="title"
                                        id="title"
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
                                    </label>
                                    <textarea
                                        name="description"
                                        id="description"
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
                            <button onClick={handleDiscard} type="reset" className="py-2 flex-2 px-4 border-2 border-blue-100/15 text-white/60 rounded-sm hover:border-red-700 hover:text-red-700 hover:bg-red-500/10 transition-colors duration-300">
                                Discard
                            </button>
                            <SubmitButton />
                        </div>
                    </Form>
                </div>
            </motion.div>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button disabled={pending} type="submit" className="py-2 px-4 cursor-pointer flex-3 border text-center bg-blue-400 flex justify-center items-center font-sans font-semibold text-black rounded-lg hover:shadow-[0_0_30px] hover:shadow-blue-400/50 transition-all duration-300">
            {pending ? <Spinner fontSize={20} /> : "Publish Post"}
        </button>
    )
}
