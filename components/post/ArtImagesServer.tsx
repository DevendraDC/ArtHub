"use server"

import { getArtImages } from "@/src/dal/posts";
import ArtImagesClient from "./ArtImagesClient";

export default async function ArtImagesServer({ postId }: { postId: string }) {
    const images = await getArtImages(postId);
    return (
        <ArtImagesClient images={images} />
    )
}