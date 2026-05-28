"use client";

import { deletePost } from "@/data/dal/Post/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function DeletePostComponent({ postId, username, userId }: { postId: string, username: string, userId: string }) {
    const queryClient = useQueryClient()
    return (
        <>
            <label htmlFor="my_modal_6" className="btn bg-transparent border-0 text-red-600"><Trash2 /> Delete post</label>
            <input type="checkbox" id="my_modal_6" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box bg-black/40 backdrop-blur-2xl">
                    <h3 className="text-lg font-bold">Delete Post</h3>
                    <p className="py-4">do you really want to delete this post?</p>
                    <div className="modal-action">
                        <label onClick={async () => {
                            const result = await deletePost(postId);
                            if (!result.success) {
                                toast.error(result.error)
                            }
                            else {
                                toast.success("post deleted successfully");
                                queryClient.invalidateQueries({
                                    queryKey: ["ProfilePage", 0, userId]
                                })
                                redirect(`/profile/${username}`)
                            }
                        }} className="btn bg-white text-black">Yes</label>
                        <label htmlFor="my_modal_6" className="btn border-0">No</label>
                    </div>
                </div>
            </div>
        </>
    )
}