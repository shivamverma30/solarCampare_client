"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react"
import en from "../locales/en.json"
import hi from "../locales/hi.json"

type MessagePrimitive = string | number | boolean | null
type MessageArray = Array<MessagePrimitive | MessageMap>
interface MessageMap {
  [key: string]: MessagePrimitive | MessageMap | MessageArray
}

interface LocaleContextValue {
  locale: string
  setLocale: (l: string) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LOCALE_COOKIE = "safwe:locale"

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

const MESSAGES: Record<string, MessageMap> = {
  en,
  hi,
}

export const LocaleProvider: React.FC<{ children: React.ReactNode; initialLocale?: string }> = ({ children, initialLocale = "hi" }) => {
  const [locale, setLocaleState] = useState<string>(() => (MESSAGES[initialLocale] ? initialLocale : "hi"))

  const setLocale = (l: string) => {
    if (!MESSAGES[l]) return
    setLocaleState(l)
    try {
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`
    } catch {
      // ignore
    }
  }

  const messages = useMemo(() => MESSAGES[locale] || MESSAGES.en, [locale])

  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    const parts = key.split(".")
    let cur: MessagePrimitive | MessageMap | MessageArray | undefined = messages
    for (const p of parts) {
      if (!cur || typeof cur !== "object" || Array.isArray(cur)) {
        cur = undefined
        break
      }

      cur = (cur as MessageMap)[p]
      if (cur === undefined) break
    }

    let str = typeof cur === "string" ? cur : key
    if (vars) {
      for (const k of Object.keys(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]))
      }
    }
    return str
  }, [messages])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export const useLocale = () => {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
