import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { Controller } from "@/src/utils/types/controller";

export function SelectMediums({ mediumsController }: { mediumsController : Controller<PostMedium[]>}) {
    const {value, setValue} = mediumsController;
    const addMediums = (med: { value: PostMedium, label: string }) => {
        if (!value.includes(med.value)) {
            setValue(prev => [...prev, med.value]);
        }
        else {
            const newMedium = value.filter(m => m !== med.value)
            setValue(newMedium);
        }
    }
    const mediums = [
        { value: PostMedium.DIGITAL, label: "Digital" },
        { value: PostMedium.OIL_PAINT, label: "Oil Paint" },
        { value: PostMedium.WATERCOLOR, label: "Watercolor" },
        { value: PostMedium.PHOTOGRAPHY, label: "Photography" },
        { value: PostMedium.ILLUSTRATION, label: "Illustration" },
        { value: PostMedium.SCULPTURE, label: "Sculpture" },
        { value: PostMedium.MIXED_MEDIA, label: "Mixed Media" },
        { value: PostMedium.SKETCH, label: "Sketch" },
        { value: PostMedium.THREE_D, label: "3D" },
        { value: PostMedium.ANIMATION, label: "Animation" },
        { value: PostMedium.LINEART, label: "Lineart" },
        { value: PostMedium.CONCEPT_ART, label: "Concept Art" },
        { value: PostMedium.ANIME_ART, label: "Anime Art" },
        { value: PostMedium.MANGA_ART, label: "Manga Art" },
        { value: PostMedium.PIXEL_ART, label: "Pixel Art" },
        { value: PostMedium.TRADITIONAL_ART, label: "Traditional Art" },
        { value: PostMedium.OTHER, label: "Other" },
    ];

    return (
        <div className="flex flex-wrap gap-3">
            {mediums.map((med) => (
                <div
                    key={med.value}
                    onClick={() => addMediums(med)}
                    className={`p-2 px-3 border transition-colors duration-300 text-sm rounded-lg cursor-pointer 
      ${value.includes(med.value)
                            ? "bg-blue-500/10 text-blue-400 border-blue-400"
                            : "text-blue-200/40 hover:text-blue-200/80 border-blue-100/13"
                        }`}
                >
                    {med.label}
                </div>
            ))}
        </div>
    )
}