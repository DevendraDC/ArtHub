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
import { useMemo, useRef, useState } from "react";
import ImageCropDialog from "@/src/components/ImageCropDialog";
import { Button } from "@/src/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/src/validators/user";
import z from "zod";
import { updateUser } from "@/src/data/dal/User/mutations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProfileSettingsData, usernameExist } from "@/src/data/dal/User/queries";
import { cloudinaryTransform } from "@/src/utils/cloudinaryTransform";
import { uploadImage } from "@/src/lib/cloudinaryFunctions";
import { Spinner } from "@/src/components/ui/spinner";
import { useSession } from "../Providers";


type data = {
    userId: string | null;
    username: string | null;
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    portfolio: string | null;
    location: string | null;
}

export default function Settings() {
    const router = useRouter()
    const session = useSession();
    if(!session || !session.user) return null;
    const { username, name, bio, image, email, portfolio, location, id } = session.user;
    const uploadFileRef = useRef<HTMLInputElement | null>(null);
    const [avatar, setAvatar] = useState<File | null>(null);
    const avatarPreview = image;
    const [openImageCrop, setOpenImageCrop] = useState(false);
    const avatarBlobUrl = useMemo(() => avatar ? URL.createObjectURL(avatar) : null, [avatar]);
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
        defaultValues: {
            artistName: name ?? "",
            username: username ?? "",
            bio: bio ?? "",
            portfolio: portfolio ?? "",
            location: location ?? ""
        },
    });

    const formSubmit = async (resolvedData: z.infer<typeof profileSchema>) => {
        if(!id) return;
        console.log("hello")
        const userData = {
            id: id,
            name: resolvedData.artistName,
            username: resolvedData.username,
            bio: resolvedData.bio ?? "",
            image: null,
            portfolio: resolvedData.portfolio,
            location: resolvedData.location
        }
        if (username !== userData.username) {
            const res = await usernameExist(userData.username);
            if (res) {
                toast.error("username already exist!");
                return;
            }
        }
        if (avatar) {
            const profileImage = await uploadImage(avatar);
            userData.image = profileImage.secure_url;
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
        <div className="w-full flex justify-center p-5 bg-transparent">
            <div className="w-[45%] flex flex-col gap-7">
                <div className="ProfilePictureUpload flex flex-col justify-center gap-5">
                    <div className="text-3xl mb-10 font-sans"><span className="text-blue-400">Profile</span> Settings</div>
                    {avatarPreview && (
                        <div className="flex flex-col items-center gap-8">
                            <img
                                src={avatarBlobUrl ?? cloudinaryTransform(avatarPreview, "f_auto,q_auto,w_100,c_limit")}
                                alt="Profile"
                                className="rounded-[50%] w-32 h-32 object-cover"
                            />
                        </div>
                    )}
                    <Input
                        type="file"
                        ref={uploadFileRef}
                        className="absolute -translate-x-999"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return;
                            setAvatar(file);
                            setOpenImageCrop(true);
                        }}
                    />
                    <button
                        type="button"
                        className="text-center mx-auto w-fit p-1 px-2 bg-(--bl4) rounded-lg flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                            uploadFileRef.current?.click();
                        }}
                    >
                        <Upload size={16} className="inline" /> upload
                    </button>
                    {openImageCrop ? <ImageCropDialog {...{
                        avatar,
                        setAvatar,
                        setOpenImageCrop
                    }} /> : null}
                </div>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>
                                <Controller
                                    name="artistName"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="artist-name">Name</FieldLabel>
                                            <Input id="artist-name" {...field} />
                                            <FieldDescription>Your name must be atleast 6 characters long</FieldDescription>
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
                                            <Input id="username" {...field} />
                                            <FieldDescription>
                                                Username must be atleast 8 characters long and must be unique
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input value={email ?? ""} disabled />
                                    <FieldDescription>User email cannot be changed</FieldDescription>
                                </Field>
                                <Controller
                                    name="bio"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="Bio">Bio</FieldLabel>
                                            <textarea
                                                className="bg-white/7 rounded-lg p-3 text-sm h-40 focus:outline-0 resize-none overflow-hidden"
                                                {...field}
                                                maxLength={300}
                                                rows={1}
                                            />
                                            <FieldDescription className="flex justify-between">
                                                Tell us about yourself (optional) <span>({field.value?.length} / 300)</span>
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="portfolio"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="portfolio">Portfolio website</FieldLabel>
                                            <Input id="portfolio" {...field} />
                                            <FieldDescription>
                                                Your portfolio website url (optional)
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="location"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="location">Location</FieldLabel>
                                            <Input id="location" {...field} />
                                            <FieldDescription>
                                                Your location/address (optional)
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Field>
                                    <Button disabled={isSubmitting} type="submit">{isSubmitting ? <Spinner fontSize={20} /> : "Save Profile"}</Button>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                </form>
            </div>
        </div>
    );
}
