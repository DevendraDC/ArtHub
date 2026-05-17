// import { getPostComments } from "@/data/dal/Post/queries";
// import { MessageSquareOff } from "lucide-react";
// import { useOptimistic } from "react";

// type Comments = {
//     id: string;
//     artPostId: string;
//     ownerId: string;
//     content: string
//     createdAt: Date;
//     user: {
//         id: string;
//         name: string | null;
//         username: string | null;
//         image: string | null;
//     };
// }

// export default async function PostComments({ postId }: { postId: string }) {
//     const { success, data } = await getPostComments(postId);
//     if (!success) return null;
//     return (
//         <main className="mt-5 flex flex-col gap-5">
//             <h1>Comments</h1>
//             <section className="flex flex-col gap-10">
//                 <section>
//                     <textarea name="comment" placeholder="leave a comment" id="comment" maxLength={200} className="bg-white/10 min-h-20 focus:outline-0 mb-2 w-full resize-none p-3 text-sm" />
//                     <button className="bg-blue-700 h-fit p-1 rounded-sm px-2 font-sans">Submit</button>
//                 </section>
//                 {!data || data.length === 0 && (
//                     <div className="text-white text-center">
//                         <MessageSquareOff size={40} className="mx-auto mb-3" />
//                         <p>There are no comments for this post yet</p>
//                     </div>
//                 )}
//             </section>
//         </main>
//     )
// }

// export function hello({comments}: {comments: Comments[]}){
//     "use client"
//     const [optimisticComments, addOptimisticComment] = useOptimistic(
//         comments,
//         (oldComments, newComment: string) => {
//             return [...oldComments, newComment]
//         }
//     )
//     return <h1>hi</h1>
// }

"use client";

import { getPostComments } from "@/data/dal/Post/queriesActions";
import { createComment } from "@/data/dal/Post/mutations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

export default function Comments({
    postId,
}: {
    postId: string;
}) {
    const [comment, setComment] = useState("");

    const queryClient = useQueryClient();

    const { data, isPending } = useQuery({
        queryKey: ["comments", postId],
        queryFn: async () => {
            const res = await getPostComments(postId);

            if (!res.success) {
                throw new Error("Failed to fetch comments");
            }

            return res.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async () => {
            await createComment(postId, comment);
        },

        onSuccess: () => {
            setComment("");
            toast.success("Comment submitted successfully");
            queryClient.invalidateQueries({
                queryKey: ["comments", postId],
            });
        },
    });

    return (
        <main className="mt-5 flex flex-col gap-5">
            <h1>Comments</h1>

            <section>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="leave a comment"
                    maxLength={200}
                    className="bg-white/10 rounded-lg min-h-20 focus:outline-0 mb-2 w-full resize-none p-3 text-sm"
                />

                <button
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate()}
                    className="bg-blue-700 h-fit p-1 rounded-sm px-2 font-sans"
                >
                    {mutation.isPending ? (<span className="loading loading-spinner"></span>): "Submit"}
                </button>
            </section>

            <section className="flex flex-col items-center gap-5">
                {isPending && <p className="loading loading-spinner text-primary text-center"></p>}

                {data?.map((comment) => (
                    <div key={comment.id} className="flex gap-5 items-start">
                        {comment.user.image && (
                            <Image
                                src={comment.user.image}
                                alt=""
                                width={40}
                                height={40}
                                className="rounded-full cursor-pointer"
                            />
                        )}

                        <section className="w-70 overflow-auto">
                            <section className="flex gap-3 text-sm">
                                <h1>{comment.user.name}</h1>
                                <p className="text-muted-foreground">
                                    {comment.user.username}
                                </p>
                            </section>

                            <p className="wrap-break-word">
                                {comment.content}
                            </p>
                        </section>
                    </div>
                ))}

                {data?.length === 0 && (
                    <p className="text-center mt-4">There are no comments yet</p>
                )}
            </section>
        </main>
    );
}