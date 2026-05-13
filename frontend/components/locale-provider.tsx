"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import en from "../locales/en.json"
import hi from "../locales/hi.json"

type Messages = Record<string, any>

interface LocaleContextValue {
  locale: string
  setLocale: (l: string) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

const MESSAGES: Record<string, Messages> = {
  en,
  hi,
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<string>("en")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("safwe:locale")
      if (stored && MESSAGES[stored]) setLocaleState(stored)
    } catch (e) {
      // ignore
    }
  }, [])

  const setLocale = (l: string) => {
    if (!MESSAGES[l]) return
    setLocaleState(l)
    try {
      localStorage.setItem("safwe:locale", l)
    } catch (e) {
      // ignore
    }
  }

  const messages = useMemo(() => MESSAGES[locale] || MESSAGES.en, [locale])

  const t = (key: string, vars?: Record<string, string | number>) => {
    const parts = key.split(".")
    let cur: any = messages
    for (const p of parts) {
      cur = cur?.[p]
      if (cur === undefined) break
    }
    let str = typeof cur === "string" ? cur : key
    if (vars) {
      for (const k of Object.keys(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]))
      }
    }
    return str
  }

  const value = useMemo(() => ({ locale, setLocale, t }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
