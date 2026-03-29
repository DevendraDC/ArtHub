"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useState } from "react"
import { UserSession } from "@/src/data/dto/userdto";

export function QueryProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      }
    }
  }));
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