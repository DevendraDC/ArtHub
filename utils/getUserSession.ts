"use server";

import { auth } from "@/src/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUserSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session){
    redirect("/login")
  }
  return session;
})

export type UserSession = Awaited<ReturnType<typeof getUserSession>>;
