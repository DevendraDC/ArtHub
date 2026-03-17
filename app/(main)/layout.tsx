"use server"

import Navbar from "@/src/components/Navbar";
import { auth } from "@/src/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session) redirect("/login");
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}