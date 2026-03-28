import { useState } from "react";
import { PostMedium } from "../lib/generated/prisma/enums";

export function useMedium(){
    const [selectedMediums, setSelectedMediums] = useState<PostMedium[]>([]);
    const addMediums = (med: { value: PostMedium, label: string }) => {
        if (!selectedMediums.includes(med.value)) {
            setSelectedMediums(prev => [...prev, med.value]);
        }
        else {
            const newMedium = selectedMediums.filter(m => m !== med.value)
            setSelectedMediums(newMedium);
        }
    }
    return {selectedMediums, setSelectedMediums, addMediums}
}