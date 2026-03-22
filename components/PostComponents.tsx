import { Dispatch, SetStateAction, useState } from "react";
import { PostMedium } from "../lib/generated/prisma/enums";
import { X } from "lucide-react";

export function SelectMediums({ selectedMediums, setSelectedMediums }: { selectedMediums: PostMedium[], setSelectedMediums: Dispatch<SetStateAction<PostMedium[]>> }) {
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
                    onClick={() => {
                        if (!selectedMediums.includes(med.value)) {
                            setSelectedMediums(prev => [...prev, med.value]);
                        }
                        else {
                            const newMedium = selectedMediums.filter(m => m !== med.value)
                            setSelectedMediums(newMedium);
                        }
                    }}
                    className={`p-2 px-3 border transition-colors duration-300 text-sm rounded-lg cursor-pointer 
      ${selectedMediums.includes(med.value)
                            ? "bg-(--amber-light) text-(--amber) border-(--amber)"
                            : "text-(--text-muted) hover:text-white border-border"
                        }`}
                >
                    {med.label}
                </div>
            ))}
        </div>
    )
}


export function SelectTags({selectedTags, setSelectedTags }: {selectedTags : string[], setSelectedTags: Dispatch<SetStateAction<string[]>> }) {
    const [tagInputVal, setTagInputVal] = useState("");
    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                name="tags"
                id="tags"
                value={tagInputVal}
                onChange={(e) => {
                    const cur = e.target.value;
                    if (cur.endsWith(",")) {
                        const curTag = cur.slice(0, -1);
                        setSelectedTags((prev) => [...new Set([...prev, curTag])]);
                        setTagInputVal("");
                    } else setTagInputVal(cur);
                }}
                placeholder="Add the tags...."
                className="border placeholder:text-(--text-subtle) w-full rounded-sm py-3 text-(--text-light) text-sm px-5 resize-none focus:outline-none border-border bg-(--surface2)"
            />
            <div className="text-xs text-(--text-subtle)">
                Enter comma to include a tag
            </div>
            {selectedTags.length > 0 && (
                <div className="flex gap-5">
                    {selectedTags.map((tag, idx) => (
                        <div
                            key={idx}
                            className="bg-(--amber-light) text-(--amber) text-sm border border-(--amber-mid) py-1 px-3 rounded-md relative"
                        >
                            {tag}{" "}
                            <X
                                onClick={() =>
                                    setSelectedTags((prev) => prev.filter((cur) => cur !== tag))
                                }
                                className="absolute w-5 h-5 p-1 font-bold text-black bg-white rounded-full -top-1 -left-2"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}