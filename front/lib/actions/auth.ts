"use server"

export interface AuthState {
  error?: string
  success?: boolean
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Заполните все поля" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Введите корректный email" }
  }

  await new Promise((r) => setTimeout(r, 500))

  return { success: true }
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!email || !password || !confirmPassword) {
    return { error: "Заполните все поля" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Введите корректный email" }
  }

  if (password.length < 6) {
    return { error: "Пароль должен содержать минимум 6 символов" }
  }

  if (password !== confirmPassword) {
    return { error: "Пароли не совпадают" }
  }

  await new Promise((r) => setTimeout(r, 500))

  return { success: true }
}
