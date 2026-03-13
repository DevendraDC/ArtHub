import { Posts } from "@/src/dal/posts";
import Image from "next/image";

export default function PostPageClient({posts} : {posts : Posts}){
    return (
        <div className="flex justify-between">
            <div className="postDetails">
                <div className="flex flex-col gap-5">
                    {post?.artImages.map(img => (
                        <div key={img}>
                            <Image src={img} alt="" width={500} height={300} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="userDetails bg-(--surface) w-[35%] p-7 flex flex-col gap-3 self-start rounded-lg border border-(--border)">
                <div className="flex gap-3">
                    <div>
                        {post?.user.image && <Image src={post?.user.image} alt="" width={60} height={60} className="rounded-full"/>}
                    </div>
                    <div>
                        <div className="font-serif">
                            {post?.user.name}
                        </div>
                        <div className="text-sm text-(--text-subtle)">
                            {post?.user.username}
                        </div>
                    </div>
                </div>
                <div className="text-(--text-muted) font-sans text-sm">
                    {post?.user.bio}
                </div>
                <div className="flex bg-(--surface2)">
                    <div>
                        {post?.user._count.artPosts}
                        Posts
                    </div>
                    <div className="border-l border-r border-border">
                        {post?.user._count.followers}
                        followers
                    </div>
                    <div>
                        {post?.user._count.following}
                        followings
                    </div>
                </div>
            </div>
        </div>
    )
}