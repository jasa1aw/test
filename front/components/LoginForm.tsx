"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { login, type AuthState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="mt-1.5 mb-4 w-full" size="lg">
      {pending ? "Вход..." : "Войти"}
    </Button>
  )
}

interface LoginFormProps {
  onSwitch: () => void
}

export function LoginForm({ onSwitch }: LoginFormProps) {
  const [state, action] = useActionState<AuthState, FormData>(login, {})

  return (
    <form action={action} noValidate>
      <div className="mb-3.5 space-y-1.5">
        <Label htmlFor="login-email">Электронная почта</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!state.error}
          className='outline-none border-none'
        />
      </div>

      <div className="mb-1.5 space-y-1.5">
        <Label htmlFor="login-password">Пароль</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={!!state.error}
          className='outline-none border-none'
        />
      </div>

      <div className="mb-5 flex justify-end">
        <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs">
          Забыли пароль?
        </Button>
      </div>

      {state.error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.success && (
        <Alert className="mb-3 border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
          <AlertDescription>Вход выполнен успешно!</AlertDescription>
        </Alert>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={onSwitch}
          className="h-auto p-0 text-sm font-medium"
        >
          Зарегистрируйтесь
        </Button>
      </p>
    </form>
  )
}
