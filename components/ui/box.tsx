import { ReactNode } from "react";

export default function Box({ children }: { children: ReactNode }) {
    return (
        <div className="images flex bg-(--surface) flex-col gap-5 border border-border p-6 rounded-xl cursor-pointer">
            <div className="text-sm font-sans tracking-widest text-(--text-muted)"><span className="text-amber-400">&middot; </span>IMAGES</div>
            {children}
        </div>
    )
}