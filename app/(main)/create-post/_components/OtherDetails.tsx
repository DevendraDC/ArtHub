import { SelectMediums } from "@/src/components/post/Mediums";
import { SelectTags } from "@/src/components/post/Tags";
import { PostMedium } from "@/src/lib/generated/prisma/enums";
import { Controller } from "@/src/utils/types/controller";


type PostOtherDetailsProps = {
    tagsController : Controller<string[]>;
    mediumsController : Controller<PostMedium[]>;
    titleController : Controller<string>;
    descriptionController : Controller<string>
};

export default function PostOtherDetails({ tagsController, mediumsController, titleController, descriptionController }: PostOtherDetailsProps) {
    return (
        <div className="details bg-(--surface) flex flex-col gap-8 border border-border p-8 rounded-xl">
            <div className="text-sm font-sans tracking-widest text-blue-200">
                <span className="text-amber-400">&middot; </span>DETAILS
            </div>
            <div className="text-sm flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        placeholder="Name your artwork...."
                        value={titleController.value}
                        name="title"
                        onChange={e => titleController.setValue(e.target.value)}
                        className="border placeholder:text-white/30 rounded-sm p-3 resize-none focus:outline-0 border-border bg-(--surface2)"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <label
                        htmlFor="description"
                        className="flex justify-between font-sans"
                    >
                        Description
                        <span className="text-xs text-(--text-subtle)">
                            {descriptionController.value.length} / 500
                        </span>
                    </label>
                    <textarea
                        name="description"
                        value={descriptionController.value}
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = `${el.scrollHeight}px`;
                        }}
                        onChange={e => descriptionController.setValue(e.target.value)}
                        maxLength={500}
                        placeholder="Tell the story behind this piece....."
                        className="border placeholder:text-white/30 rounded-sm p-4 resize-none focus:outline-0 border-border bg-(--surface2)"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="text-sm font-sans">
                        Medium
                    </div>
                    <SelectMediums mediumsController={mediumsController}/>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="tags" className="font-sans">
                        Tags
                    </label>
                    <SelectTags tagsController={tagsController} />
                </div>
            </div>
        </div>
    )
}