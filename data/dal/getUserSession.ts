import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export type SessionType = Awaited<ReturnType<typeof getUserSession>>;
