"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react"
import { SessionType } from "@/src/data/dal/getUserSession";

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

export const SessionContext = createContext<SessionType>(null)

export function SessionProvider({
  children,
  session
}: {
  children: React.ReactNode,
  session: SessionType
}) {
  return <SessionContext value={session} >{children}</SessionContext>
}

export function useSession() {
  return useContext(SessionContext);
}