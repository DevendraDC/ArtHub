"use client"

import { Button } from "@/src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field"
import { Input } from "@/src/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { authSchema } from "@/src/utils/zodSchema"
import z from "zod"
import { toast } from "sonner"
import { signupUser } from "@/src/dal/user-auth"
import { useRouter } from "next/navigation"



export function SignupForm() {
  const router = useRouter()
  const { handleSubmit, control, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const onSubmit = async (data: z.infer<typeof authSchema>) => {
    console.log("submit")
    const { success, error } = await signupUser(data)
    if (success) {
      router.push(`/verify-email?email=${data.email}`)
    }
    else {
      toast(error)
    }

  }

  return (
    <Card className="bg-transparent border-0">
      <CardHeader>
        <CardTitle className="text-center text-2xl mb-3">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input {...field} id="password" type="password" />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting}>Create Account</Button>
                <Button variant="outline" type="button" disabled={isSubmitting}>
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
