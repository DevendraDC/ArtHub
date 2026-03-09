"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup } from "../ui/field";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "sonner";
import { verifyUser } from "@/dal/verify-user";
import { useRouter } from "next/navigation";



export default function EmailVerify({ email }: { email: string }) {
    const router = useRouter()
    const [code, setCode] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const formSubmit = async (e: React.SubmitEvent) => {
        setIsSubmitting(true)
        e.preventDefault()
        if (code.length !== 6) {
            toast("please enter the complete verification code")
            setIsSubmitting(false);
            return;
        }
        const { success, error } = await verifyUser(code, email)
        if (!success) {
            toast(error)
            setIsSubmitting(false)
            return;
        }
        else {
            toast("User verified successfully")
            router.push("/login")
        }
    }
    return (
        <Card className="bg-transparent border-0">
            <CardHeader>
                <CardTitle className="text-center mb-5 text-2xl">Verify your account</CardTitle>
                <CardDescription className="text-center">Enter the 6 digit code send to your email address</CardDescription>
            </CardHeader>
            <CardContent>
                <form id="verify-email" onSubmit={formSubmit}>
                    <FieldGroup>
                        <Field>
                            <InputOTP maxLength={6} value={code} onChange={e => setCode(e)}>
                                <InputOTPGroup>
                                    {[0, 1, 2, 3, 4, 5].map((key) => (
                                        <InputOTPSlot index={key} key={key} className="h-14 w-14" />
                                    ))}
                                </InputOTPGroup>
                            </InputOTP>
                        </Field>
                        <FieldGroup>
                            <Field className="text-sm w-fit text-white/60 underline cursor-pointer hover:text-white transition-colors duration-200">Resend code</Field>
                            <Field>
                                <Button type="submit" form="verify-email" disabled={code.length !== 6 || isSubmitting}>Verify</Button>
                            </Field>
                        </FieldGroup>

                    </FieldGroup>

                </form>
            </CardContent>
        </Card>
    )
}