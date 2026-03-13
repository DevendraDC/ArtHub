import { Post } from "@/src/dal/posts";
import Image from "next/image";

export default function PostModal({ post }: { post: Post }) {
    return (
        <div className="w-[100vw] h-[100vh] absolute z-999 bg-(--surface)/50 backdrop-blur-lg  flex  inset-0 p-10 overflow-hidden top-1/2 left-1/2 -translate-1/2">
            <div className="flex flex-col gap-5 w-[75%] items-center overflow-y-auto">
                {post.artImages.map(image => (
                    <div key={image}>
                        <Image src={image} alt="" width={420} height={400} />
                    </div>
                ))}
            </div>
            <div className=" bg-black">
                dvdvdv
            </div>
        </div>
    )
}