"use client"

import { toggleSave } from "@/data/dal/Post/queriesActions";
import { Bookmark } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";

type data = {
    isSaved: boolean;
    saves: number;
    postId: string;
    userId: string;
}

export default function OptimisticSave({ data }: { data: data}) {
    const {isSaved, saves, postId, userId} = data;
    const [isPending, startTransition] = useTransition();
    const [baseSaveState, setBaseSaveState] = useState({
        isSaved, saves
    })
    const [optimisticSaveState, updateOptimisticSave] = useOptimistic(
        baseSaveState,
        (current, isSaved: boolean) => ({
            isSaved,
            saves: current.saves + (isSaved ? +1 : -1)
        })
    )
    const handleSaveToggle = () => {
        // if (!postInfo?.id) return;
        const oldSaveState = optimisticSaveState.isSaved;
        const newSavedState = !optimisticSaveState.isSaved;
        startTransition(async () => {
            updateOptimisticSave(newSavedState);
            try {
                await toggleSave(postId, userId, oldSaveState);
                setBaseSaveState((prev) => ({
                    isSaved: newSavedState,
                    saves:
                        prev.saves + (newSavedState ? +1 : -1),
                }));
            } catch (error) {
                updateOptimisticSave(!newSavedState)
            }
        })
    }
    return (
        <button
            onClick={handleSaveToggle}
            disabled={isPending}
            className="flex gap-2 hover:bg-white/10 cursor-pointer w-fit p-2 rounded-lg transition-colors"
        >
            <Bookmark
                size={22}
                className={`transition-colors ${optimisticSaveState.isSaved ? "fill-blue-600 stroke-blue-600" : "stroke-current"}`}
            />
            <div className="text-white/45">{optimisticSaveState.saves}</div>
        </button>
    )
}