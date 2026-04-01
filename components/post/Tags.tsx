import { ChangeEvent } from "react";
import { X } from "lucide-react";
import { Controller } from "@/src/utils/types/controller";


export function SelectTags({tagsController} : {tagsController : Controller<string[]>}) {
    const {value, setValue} = tagsController;
    const onTagChange = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const cur = e.target.value;
        if (cur.endsWith(",")) {
          const curTag = cur.slice(0, -1);
          setValue((prev) => [...new Set([...prev, curTag])]);
          e.target.value = "";
        }
      };
    
      const addTags = (tag: string) => {
        setValue((prev) => prev.filter((cur) => cur !== tag));
      };
    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                name="tags"
                id="tags"
                onChange={(e) => onTagChange(e)}
                placeholder="Add the tags...."
                className="border placeholder:text-white/40 w-full rounded-sm py-3 text-sm px-5 resize-none focus:outline-none"
            />
            <div className="text-xs text-blue-100/40">
                Enter comma to include a tag
            </div>
            {value.length > 0 && (
                <div className="flex gap-5">
                    {value.map((tag, idx) => (
                        <div
                            key={idx}
                            className="bg-blue-800 text-sm py-2 px-4 rounded-md relative"
                        >
                            {tag}{" "}
                            <X
                                onClick={() => addTags(tag)}
                                className="absolute w-5 h-5 p-0 font-bold text-black bg-white/50 rounded-full -top-1 -left-2"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}