"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export interface AuthState {
  error?: string
  success?: boolean
}

const API_URL = process.env.API_URL ?? "http://localhost:3001"

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Заполните все поля" }
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    return { error: "Неверный email или пароль" }
  }

  const setCookie = res.headers.get("set-cookie")
  if (setCookie) {
    const match = setCookie.match(/token=([^;]+)/)
    if (match) {
      const cookieStore = await cookies()
      cookieStore.set("token", match[1], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    }
  }

  redirect("/task-list")
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!email || !password || !confirmPassword) {
    return { error: "Заполните все поля" }
  }

  if (password.length < 6) {
    return { error: "Пароль должен содержать минимум 6 символов" }
  }

  if (password !== confirmPassword) {
    return { error: "Пароли не совпадают" }
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    return { error: "Ошибка регистрации" }
  }

  return { success: true }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (token) {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { Cookie: `token=${token}` },
    })

    cookieStore.delete("token")
  }

  redirect("/auth")
}
