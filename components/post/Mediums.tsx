import { PostMedium } from "@/lib/generated/prisma/enums";
import { Controller } from "@/utils/types/controller";

export const Mediums = [
    { value: PostMedium.DIGITAL, label: "Digital" },
    { value: PostMedium.OIL_PAINT, label: "Oil Paint" },
    { value: PostMedium.WATERCOLOR, label: "Watercolor" },
    { value: PostMedium.PHOTOGRAPHY, label: "Photography" },
    { value: PostMedium.ACRYLIC, label: "Acrylic" },
    { value: PostMedium.SCULPTURE, label: "Sculpture" },
    { value: PostMedium.MIXED_MEDIA, label: "Mixed Media" },
    { value: PostMedium.SKETCH, label: "Sketch" },
    { value: PostMedium.THREE_D, label: "3D" },
    { value: PostMedium.ANIMATION, label: "Animation" },
    { value: PostMedium.TWO_D, label: "2D" },
    { value: PostMedium.VFX, label: "VFX" },
    { value: PostMedium.INK, label: "Ink" },
    { value: PostMedium.CRAYON, label: "Crayon" },
    { value: PostMedium.PASTELS, label: "Pastels" },
    { value: PostMedium.ALCOHOL_MARKERS, label: "Alcohol Markers" },
    { value: PostMedium.COLORED_PENCIL, label: "Colored Pencils" },
    { value: PostMedium.TRADITIONAL_ART, label: "Traditional Art" },
    { value: PostMedium.OTHER, label: "Other" },
];

export function SelectMediums({ mediumsController }: { mediumsController: Controller<PostMedium[]> }) {
    const { value, setValue } = mediumsController;
    const addMediums = (med: { value: PostMedium, label: string }) => {
        if (!value.includes(med.value)) {
            setValue(prev => [...prev, med.value]);
        }
        else {
            const newMedium = value.filter(m => m !== med.value)
            setValue(newMedium);
        }
    }


    return (
        <div className="flex flex-wrap gap-3">
            {Mediums.map((med) => (
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