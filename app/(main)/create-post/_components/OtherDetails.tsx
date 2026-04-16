import { SelectMediums } from "@/components/post/Mediums";
import { SelectTags } from "@/components/post/Tags";
import { PostMedium } from "@/lib/generated/prisma/enums";
import { Controller } from "@/utils/types/controller";


type PostOtherDetailsProps = {
    tagsController : Controller<string[]>;
    mediumsController : Controller<PostMedium[]>;
    titleController : Controller<string>;
    descriptionController : Controller<string>
};

export default function PostOtherDetails({ tagsController, mediumsController, titleController, descriptionController }: PostOtherDetailsProps) {
    return (
        <div className="details flex flex-col gap-8 p-8 rounded-xl">
            {/* <div className="font-sans text-blue-200">
                <span className="text-blue-500">&middot; </span>DETAILS
            </div> */}
            <div className="text-sm flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        placeholder="Name your artwork...."
                        value={titleController.value}
                        name="title"
                        onChange={e => titleController.setValue(e.target.value)}
                        className="border placeholder:text-white/40 rounded-sm p-3 resize-none focus:outline-0"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <label
                        htmlFor="description"
                        className="flex justify-between"
                    >
                        Description
                        <span className="text-xs">
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
                        className="border placeholder:text-white/40 rounded-sm p-4 resize-none focus:outline-0 border-border bg-(--surface2)"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <div className="text-sm">
                        Medium
                    </div>
                    <SelectMediums mediumsController={mediumsController}/>
                </div>
                <div className="flex flex-col gap-3">
                    <label htmlFor="tags" className="text-sm">
                        Tags
                    </label>
                    <SelectTags tagsController={tagsController} />
                </div>
            </div>
        </div>
    )
}