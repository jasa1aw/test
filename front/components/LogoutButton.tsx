"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions/auth"

export function LogoutButton() {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => logout())}
      className="w-full text-xs font-medium text-[#6b7280] bg-transparent border-[#e5e7eb] hover:text-[#111111] hover:border-[#9ca3af] hover:bg-[#f9fafb] cursor-pointer"
    >
      {pending ? "Выход..." : "Выйти"}
    </Button>
  )
}
