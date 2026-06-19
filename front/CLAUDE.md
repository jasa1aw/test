@AGENTS.md
## Стек проекта

- **Next.js 16** (App Router)
- **React 19**
- **shadcn/ui** (v4.11) — компоненты на основе Radix
- **Tailwind CSS v4**
- **Bun** — package manager и runtime

## Установка зависимостей

Всегда используем Bun, никогда npm/yarn/pnpm:

```bash
bun install
bun add <package>
bun remove <package>
bun run dev
bun run build
```

## Структура проекта

```
app/                      # роуты (App Router)
  layout.tsx
  page.tsx
  loading.tsx
  error.tsx
  not-found.tsx
  (feature)/
    page.tsx
    loading.tsx
    error.tsx

components/
  ui/                     # ТОЛЬКО автогенерированные shadcn-компоненты
    button.tsx
    alert.tsx
    dialog.tsx
  AuthModal.tsx           # собственные компоненты — PascalCase
  UserCard.tsx
  ProductList.tsx

lib/
  actions/                # Server Actions ("use server")
  api/                    # серверные функции получения данных
  utils.ts

hooks/                    # клиентские хуки ("use client")
```

### Правила для `components/ui`

- В эту папку НИЧЕГО не пишем руками.
- Любой новый UI-компонент добавляется только через CLI:

```bash
bunx --bun shadcn@latest add <component>
# пример
bunx --bun shadcn@latest add alert dialog dropdown-menu
```
- Если нужного компонента нет в shadcn — собственная обёртка создаётся в `components/`, а не в `components/ui/`.

### Правила для `components/*`

- Каждый файл — один компонент, имя файла = имя компонента, **PascalCase**: `AuthModal.tsx`, `ProductCard.tsx`.
- Компонент должен быть максимально переиспользуемым:
  - Принимать данные и колбэки через пропсы, не хардкодить бизнес-логику внутри UI-компонента.
  - Разделять "глупые" презентационные компоненты и "умные" контейнеры, которые дёргают данные/действия.
  - Если один и тот же UI-паттерн повторяется в 2+ местах — выносить в общий компонент сразу, не дублировать.
  - Использовать `children`/`slots`-пропсы вместо жёсткой разметки, где это уместно.

## Работа с данными (Server-first подход)

По умолчанию — **Server Components**. `"use client"` ставим только там, где реально нужна интерактивность (стейт, эффекты, обработчики событий, браузерные API).

### Получение данных

- Запросы к API делаем прямо в Server Components (`async function Page()`), без лишних client-side fetch'ей.
- Кэширование данных — через `unstable_cache` / `use cache` (Next.js 16 Cache Components):

```ts
// lib/api/products.ts
import { cacheLife, cacheTag } from "next/cache";

export async function getProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const res = await fetch("https://api.example.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
```

- Инвалидация кэша — через `revalidateTag` / `revalidatePath` внутри Server Actions.

### Мутации — Server Actions

- Все изменяющие данные операции (создание, обновление, удаление) — через `"use server"` Server Actions в `lib/actions/`.

```ts
// lib/actions/auth.ts
"use server";

import { revalidateTag } from "next/cache";

export async function login(formData: FormData) {
  // валидация, вызов API
  revalidateTag("user");
}
```

- На клиенте формы используют `useActionState` / `useFormStatus` (React 19) вместо ручного `onSubmit` + `fetch`, если это форма.
- Императивные вызовы action (не из формы) — через хук `useTransition` + вызов server action внутри `startTransition`.

### Когда нужен Client Component

- Используется состояние (`useState`, `useReducer`), эффекты, подписки, обработчики DOM-событий.
- В начале файла — `"use client"`.
- Такие компоненты держим максимально маленькими ("листовыми"), оборачивая серверные компоненты вокруг них, а не наоборот.

## Условные UI-файлы Next.js

Для каждого сегмента роута, где это уместно, создаём:

- `loading.tsx` — скелетон/спиннер через `<Suspense>` boundary (Next.js делает это автоматически для сегмента).
- `error.tsx` — обязательно `"use client"`, принимает `error` и `reset`, показывает пользователю понятное сообщение и кнопку повтора.
- `not-found.tsx` — кастомная страница 404 для сегмента, вызывается через `notFound()` из `next/navigation`.

Пример `error.tsx`:

```tsx
"use client";
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-sm text-muted-foreground">Что-то пошло не так</p>
      <button onClick={() => reset()} className="underline">
        Попробовать снова
      </button>
    </div>
  );
}
```

## Изображения

- Всегда `Image` из `next/image`, никогда `<img>`.
- Обязательно указывать `width`/`height` или `fill` + контейнер с заданными размерами.
- Для внешних доменов — добавлять домен в `next.config.ts` (`images.remotePatterns`).

```tsx
import Image from "next/image";

<Image src="/logo.svg" alt="Logo" width={120} height={40}/>
```

## Стилизация

- Только Tailwind v4 utility-классы, без отдельных `.css`-модулей (кроме `globals.css` с токенами темы).
- Цвета/радиусы/шрифты берём из CSS-переменных, заданных shadcn-темой (`globals.css`), не хардкодим хексы в компонентах.
- Для условных классов — `cn()` из `lib/utils.ts` (стандартная shadcn-утилита на `clsx` + `tailwind-merge`).

## TypeScript

- Строгая типизация, `any` не использовать.
- Пропсы компонентов — через `interface ComponentNameProps`.
- Серверные функции и actions — явно типизировать возвращаемое значение.

## Общие правила для Claude Code

1. Перед добавлением UI-компонента — проверить, есть ли он уже в `components/ui`; если нет, ставить через `bunx --bun shadcn@latest add`, не писать Radix-обёртки руками.
2. Не создавать client component, если задачу можно решить на сервере.
3. Любая мутация данных — Server Action, не route handler и не client-side POST, если не требуется специально (вебхуки, сторонние интеграции).
4. Для каждой новой страницы — проверять, нужны ли `loading.tsx`/`error.tsx`/`not-found.tsx`.
5. Все изображения — через `next/image`.
6. Команды зависимостей и скрипты — только через `bun`/`bunx --bun`.
7. Имена файлов в `components/` — PascalCase и совпадают с именем экспортируемого компонента.