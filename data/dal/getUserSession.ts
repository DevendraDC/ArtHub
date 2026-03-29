"use server";

import { auth } from "@/src/lib/better-auth/auth";
import { headers } from "next/headers";
import { cache } from "react";
import { sessionDTO } from "../dto/userdto";

export const getUserSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return sessionDTO(session);
});
