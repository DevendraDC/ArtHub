"use client";

import { Upload } from "lucide-react";
import {
    FieldGroup,
    FieldSet,
    FieldDescription,
    Field,
    FieldLabel,
    FieldError,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { useRef, useState } from "react";
import ImageCropDialog from "@/src/components/ImageCropDialog";
import { Button } from "@/src/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/src/validators/user";
import z from "zod";
import { updateUser } from "@/src/dal/user-queries";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserSession } from "@/src/dal/getUserSession";

export default function Settings({
    userSession,
}: {
    userSession: UserSession;
}) {
    const router = useRouter()
    const uploadFileRef = useRef<HTMLInputElement | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(userSession.user.image ? userSession.user.image : null);
    const [curAvatar, setCurAvatar] = useState<File | null>(null);
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            artistName: userSession.user.name,
            username: userSession.user.username ?? "",
            bio: userSession.user.bio,
            userId: userSession.user.id
        },
    });

    const formSubmit = async (data: z.infer<typeof profileSchema>) => {
        const userData = {
            id: userSession.user.id,
            name: data.artistName,
            username: data.username,
            bio: data.bio ? data.bio : "",
            image: curAvatar,
            email: userSession.user.email
        }

        const { success, error } = await updateUser(userData)
        if (!success) {
            toast(error);
            return;
        }
        else {
            toast("Profile updated successfully")
            router.push("/")
        }
    }

    return (
        <div className="w-full flex justify-center p-5 bg-(--bg)">
            <div className="w-[55%] flex flex-col gap-7">
                <form onSubmit={handleSubmit(formSubmit)}>
                    <FieldGroup>
                        <FieldSet>
                            <div className="text-center text-2xl mb-5">Profile</div>
                            <FieldGroup>
                                <Field>
                                    {preview ? <div className="flex flex-col items-center gap-8">
                                        <img
                                            src={preview}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-[50%] object-cover"
                                        />

                                    </div> : (
                                        <svg viewBox="0 0 128 128" className="w-22 h-22">
                                            <circle cx="64" cy="64" r="64" fill="#E5E7EB" />
                                            <circle cx="64" cy="48" r="20" fill="#9CA3AF" />
                                            <path d="M32 104c0-18 14-30 32-30s32 12 32 30" fill="#9CA3AF" />
                                        </svg>
                                    )}

                                    <Input
                                        type="file"
                                        ref={uploadFileRef}
                                        className="absolute -translate-x-999"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return;
                                            const image = URL.createObjectURL(file)
                                            setAvatar(image)
                                        }}
                                    />
                                </Field>
                                <div
                                    className="text-center hover-col cursor-default"
                                    onClick={() => {
                                        uploadFileRef.current?.click();
                                    }}
                                >
                                    <Upload className="inline w-5 h-5" /> upload
                                </div>

                                {avatar ? <ImageCropDialog avatar={avatar} setPreview={setPreview} setAvatar={setAvatar} setCurAvatar={setCurAvatar} /> : null}

                                <Controller
                                    name="artistName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="artist-name">Artist Name</FieldLabel>
                                            <Input id="artist-name" placeholder="john doe" {...field} />
                                            <FieldDescription>Your artist name must be atleast 6 characters long</FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="username">Username</FieldLabel>
                                            <Input id="username" placeholder="john@doe" {...field} />
                                            <FieldDescription>
                                                username must be atleast 8 characters long and must be unique
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        placeholder={userSession.user.email}
                                        disabled
                                    />
                                    <FieldDescription>user email cannot be changed</FieldDescription>
                                </Field>
                                <Controller
                                    name="bio"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="Bio">Bio</FieldLabel>
                                            <textarea
                                                className="bg-white/7 rounded-lg p-3 text-sm h-25 focus:outline-0 resize-none overflow-hidden"
                                                placeholder="tell us something about yourself"
                                                {...field}
                                                maxLength={5000}
                                                rows={1}
                                                onInput={(e) => {
                                                    const el = e.currentTarget;
                                                    el.style.height = "auto";
                                                    el.style.height = `${el.scrollHeight}px`;
                                                }}
                                            />
                                            <FieldDescription>
                                                write something about yourself
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Field>
                                    <Button disabled={isSubmitting} type="submit">Save Profile</Button>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}
