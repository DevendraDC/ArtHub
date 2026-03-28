"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext } from "react"
import { UserSession } from "@/src/utils/getUserSession"

export function QueryProviders({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export const SessionContext = createContext<Promise<UserSession> | null>(null)

export function SessionProvider({
  children,
  sessionPromise
}: {
  children: React.ReactNode,
  sessionPromise: Promise<UserSession>
}) {
  return <SessionContext value={sessionPromise} >{children}</SessionContext>
}