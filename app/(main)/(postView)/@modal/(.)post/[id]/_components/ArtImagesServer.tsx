"use server"

import { getArtImages } from "@/src/data/dal/Post/queries";
import ArtImagesClient from "./ArtImagesClient";

export default async function ArtImagesServer({ params }: { params: Promise<{ id: string }> }) {
    const {id} = await params;
    const images = await getArtImages(id);
    return (
        <ArtImagesClient images={images} />
    )
}