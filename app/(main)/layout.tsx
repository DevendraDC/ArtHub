"use server"

import Navbar from "@/src/components/Navbar";
import { getSession } from "@/src/utils/getSession";
import SessionProvider from "./SessionProvider";

export default async function MainLayout({
    children,
    modal
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    const session = await getSession();
    return (
        <SessionProvider session={session}>
            <Navbar />
            {modal}
            {children}
        </SessionProvider>
    );
}