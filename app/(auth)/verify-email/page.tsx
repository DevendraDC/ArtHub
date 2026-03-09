"use server"

import EmailVerify from "@/components/auth/Email-verify";

type Props = {
    searchParams: Promise<{ email?: string }>
}


export default async function EmailVerificationPage({ searchParams }: Props) {
    const params = await searchParams
    const email = params.email ?? ""
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <EmailVerify email={email} />
            </div>
        </div>
    )
}