"use server"

import Navbar from "@/src/components/Navbar/Navbar";
import { QueryProviders, SessionProvider } from "./Providers";
import { getUserSession } from "@/src/data/dal/getUserSession";


export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();
    return (
        <div className="min-h-screen bg-black">
            <div className="bg-blue-500 opacity-30 absolute -top-15 left-1/2 -translate-x-1/2 w-390 h-50 rounded-full blur-[120px]"></div>
            <div className="relative top-10 mx-auto w-[70%] z-999 mb-20">
                <Navbar session={session}/>
            </div>
            <div>
                <QueryProviders>
                    <SessionProvider session={session}>
                    {children}
                    </SessionProvider>
                </QueryProviders>
            </div>
        </div>
    );
}