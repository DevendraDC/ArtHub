"use client";

import { useState } from "react";

export default function TabShell({ tabs, panels }: {
    tabs: string[];
    panels: React.ReactNode[];
}) {
    const [curFilter, setCurFilter] = useState(0);

    return (
        <div className="bg-(--bg) flex justify-center mt-3">
            <div className="w-[88%] flex flex-col justify-center items-center gap-8 p-5">
                <div className="flex gap-6 bg-white/6 w-fit p-2 px-4 text-white/50 text-sm rounded-lg">
                    {tabs.map((tab, i) => (
                        <div
                            key={i}
                            onClick={() => setCurFilter(i)}
                            className={`${curFilter === i && "bg-amber-400 text-black rounded-sm font-semibold"} cursor-pointer px-2 py-1`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                {panels[curFilter]}
            </div>
        </div>
    );
}