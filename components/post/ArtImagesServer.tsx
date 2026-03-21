"use server"

import { getArtImages } from "@/src/dal/posts";
import ArtImagesClient from "./ArtImagesClient";

export default async function ArtImagesServer({ postId }: { postId: Promise<string> }) {
    const id = await postId;
    const images = await getArtImages(id);
    return (
        <ArtImagesClient images={images} />
    )
}