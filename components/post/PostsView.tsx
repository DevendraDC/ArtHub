import Image from "next/image";
import Link from "next/link";
import { cloudinaryTransform } from "@/utils/cloudinaryTransform";
import { ClassNameValue, twMerge } from "tailwind-merge";

type Posts = ({
    id: string;
    title: string;
    thumbnail: string;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        username: string | null;
        image: string | null;
    };
} | null)[]

export default function PostsView({ posts, className }: { posts: Posts, className: ClassNameValue }) {
    return (
        <div>
            <div className={twMerge(`grid grid-cols-6 gap-2`, className)}>
                {posts.map((post) => {
                    if (!post) return null;
                    const url = post.thumbnail;
                    const previewUrl = cloudinaryTransform(url, "370")
                    return (
                        <Link href={`/post/${post.id}`} key={post.id}>
                            <div
                                key={post.id}
                                className="w-60 h-60 aspect-square relative bg-transparent group"
                            >
                                <Image
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    loading="eager"
                                    src={previewUrl}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                                <div
                                    className="p-2 flex flex-col gap-3 absolute bottom-0 justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-0 z-9 bg-black mask-t-from-1% to-transparent"
                                >
                                    <div className="flex text-xs justify-between items-center">
                                        <div className="flex gap-3 items-center">
                                            {post.user.image && (
                                                <Image
                                                    src={post.user.image}
                                                    alt=""
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <div className="flex flex-col">
                                                <h1 className="text-sm">{post.title}</h1>
                                                <p className="text-xs text-blue-100/60">
                                                    {post.user.username}
                                                </p>
                                            </div>
                                        </div>
                                        {/* <div className="text-blue-100/40 text-xs">
                                            {postTime(post.createdAt)}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
