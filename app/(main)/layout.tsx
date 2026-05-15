"use server"

import Navbar from "@/components/Navbar/Navbar";
import { QueryProviders, SessionProvider } from "./Providers";
import { getUserSession } from "@/data/dal/getUserSession";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();
    return (
        <div className="min-h-screen bg-white/2">
            <div className="bg-blue-700 opacity-50 absolute -top-15 left-1/2 -translate-x-1/2 w-300 h-50 rounded-full blur-[120px]"></div>
                <Navbar session={session}/>
            <div className="mt-5">
                <QueryProviders>
                    <SessionProvider session={session}>
                        <NuqsAdapter>
                            {children}
                        </NuqsAdapter>
                    </SessionProvider>
                </QueryProviders>
            </div>
        </div>
    );
}