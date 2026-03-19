"use client"

import React, { createContext } from "react"
import { UserSession } from "@/src/utils/getUserSession"

export const SessionContext = createContext<Promise<UserSession> | null>(null)

export default function SessionProvider({
  children,
  sessionPromise
} : {
  children : React.ReactNode,
  sessionPromise : Promise<UserSession>
}) {
  return <SessionContext value={sessionPromise} >{children}</SessionContext>
}