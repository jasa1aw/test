"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { register, type AuthState } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="mt-1.5 mb-4 w-full" size="lg">
      {pending ? "Создание аккаунта..." : "Создать аккаунт"}
    </Button>
  )
}

interface RegisterFormProps {
  onSwitch: () => void
}

export function RegisterForm({ onSwitch }: RegisterFormProps) {
  const [state, action] = useActionState<AuthState, FormData>(register, {})

  return (
    <form action={action} noValidate>
      <div className="mb-3.5 space-y-1.5">
        <Label htmlFor="reg-email">Электронная почта</Label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          aria-invalid={!!state.error}
          className='outline-none border-none'
        />
      </div>

      <div className="mb-3.5 space-y-1.5">
        <Label htmlFor="reg-password">Пароль</Label>
        <Input
          id="reg-password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={!!state.error}
          className='outline-none border-none'
        />
      </div>

      <div className="mb-5 space-y-1.5">
        <Label htmlFor="reg-confirm">Подтвердите пароль</Label>
        <Input
          id="reg-confirm"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          aria-invalid={!!state.error}
          className='outline-none border-none'
        />
      </div>

      {state.error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.success && (
        <Alert className="mb-3 border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400">
          <AlertDescription>
            Аккаунт создан!{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="underline font-medium"
            >
              Войдите
            </button>
          </AlertDescription>
        </Alert>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={onSwitch}
          className="h-auto p-0 text-sm font-medium"
        >
          Войдите
        </Button>
      </p>
    </form>
  )
}
