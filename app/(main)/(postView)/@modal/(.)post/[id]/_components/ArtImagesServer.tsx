"use server"

import { getArtImages } from "@/src/data/dal/posts";
import ArtImagesClient from "./ArtImagesClient";

export default async function ArtImagesServer({ id }: { id: string }) {
    const images = await getArtImages(id);
    return (
        <ArtImagesClient images={images} />
    )
}