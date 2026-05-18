import { cloudinaryTransform } from "@/utils/cloudinaryTransform";
import Image from "next/image";
import { getArtImages } from "@/data/dal/Post/queries";

export default async function ArtImages({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const images = await getArtImages(id);
    return (
        <div className="carousel carousel-vertical rounded-box h-[85%] w-full">
            {images.map(img => (
                <div
                    key={img.id}
                    className="carousel-item h-full mx-auto"
                    
                >
                    <Image
                        src={img.url}
                        alt=""
                        width={1000}
                        height={1000}
                        loading="lazy"
                        className="object-contain h-full w-auto max-w-full"
                    />
                </div>
            ))}
        </div>
    )
}

// cloudinaryTransform(img.url, "1000")
