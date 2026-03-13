"use client";

import { Session } from "@/src/utils/getSession";
import { createContext, useContext } from "react";

const SessionContext = createContext<Session | undefined>(undefined);

interface Props{
    session : Session,
    children : React.ReactNode
}

export default function SessionProvider({ session, children } : Props) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("Session missing");
  return session;
}