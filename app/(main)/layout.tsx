"use server"

import Navbar from "@/src/components/Navbar";
import { QueryProviders } from "./Providers";


export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black">
            <div className="bg-blue-500 opacity-30 absolute -top-15 left-1/2 -translate-x-1/2 w-390 h-50 rounded-full blur-[120px]"></div>
            <div className="relative top-10 mx-auto w-[70%] z-999 mb-20">
                <Navbar />
            </div>
            <div>
                <QueryProviders>
                    {children}
                </QueryProviders>
            </div>
        </div>
    );
}