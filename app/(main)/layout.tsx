import Navbar from "@/components/Navbar/Navbar";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white/2 overflow-x-hidden">
            <div className="bg-blue-700 opacity-50 absolute -top-15 left-1/2 -translate-x-1/2 w-300 h-50 rounded-full blur-[120px]"></div>
            <Navbar />
            <div className="mt-5">
                <NuqsAdapter>
                    {children}
                </NuqsAdapter>
            </div>
        </div>
    );
}