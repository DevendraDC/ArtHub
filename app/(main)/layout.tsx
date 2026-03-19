"use server"

import Navbar from "@/src/components/Navbar";
import { getUserSession } from "@/src/utils/getUserSession";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = getUserSession()

    if (!session) redirect("/login");
    return (
        <>
            <Navbar />
            <SessionProvider sessionPromise={session}>
                {children}
            </SessionProvider>

        </>
    );
}