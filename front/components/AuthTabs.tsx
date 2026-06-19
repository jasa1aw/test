"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LoginForm } from "@/components/LoginForm"
import { RegisterForm } from "@/components/RegisterForm"

type Tab = "login" | "register"

const TABS: { id: Tab; label: string }[] = [
  { id: "login", label: "Вход" },
  { id: "register", label: "Регистрация" },
]

export function AuthTabs() {
  const [tab, setTab] = useState<Tab>("login")

  return (
    <>
      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-muted p-1" role="tablist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-150",
              tab === id
                ? "bg-card text-foreground shadow-sm dark:border dark:border-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div id="panel-login" role="tabpanel" hidden={tab !== "login"}>
        <LoginForm onSwitch={() => setTab("register")} />
      </div>
      <div id="panel-register" role="tabpanel" hidden={tab !== "register"}>
        <RegisterForm onSwitch={() => setTab("login")} />
      </div>
    </>
  )
}
