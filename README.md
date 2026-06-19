# Task Manager

Fullstack-приложение для управления задачами с авторизацией и обновлениями в реальном времени через WebSocket.

## Стек технологий

### Backend (`/back`)
| Технология | Версия | Назначение |
|---|---|---|
| NestJS | 11 | HTTP-сервер и WebSocket |
| Prisma | 7 | ORM и миграции |
| PostgreSQL | — | База данных |
| JWT + Passport | — | Аутентификация |
| Socket.io | — | WebSocket (real-time обновления) |
| bcrypt | — | Хэширование паролей |
| TypeScript | 5 | Язык разработки |

### Frontend (`/front`)
| Технология | Версия | Назначение |
|---|---|---|
| Next.js | 16 (App Router) | React-фреймворк |
| React | 19 | UI |
| TanStack Query | 5 | Серверное состояние и кэш |
| Socket.io Client | 4 | WebSocket-подписки |
| Tailwind CSS | 4 | Стилизация |
| shadcn/ui | — | UI-компоненты |
| Bun | — | Package manager и runtime |
| TypeScript | 5 | Язык разработки |

---

## Структура проекта

```
.
├── back/                        # NestJS API
│   ├── src/
│   │   ├── auth/                # Регистрация, логин, JWT-стратегия
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── jwtAuth.guard.ts
│   │   ├── tasks/               # CRUD задач + WebSocket gateway
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.gateway.ts
│   │   │   └── tasks.module.ts
│   │   ├── dto/                 # Классы валидации входных данных
│   │   │   ├── auth.dto.ts
│   │   │   └── tasks.dto.ts
│   │   ├── prisma/              # PrismaService (singleton)
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma        # Модели User и Task
│   │   └── migrations/
│   ├── .env                     # Переменные окружения
│   └── package.json
│
└── front/                       # Next.js App Router
    ├── app/
    │   ├── auth/
    │   │   └── page.tsx         # Страница входа / регистрации
    │   ├── task-list/
    │   │   └── page.tsx         # Список задач
    │   ├── layout.tsx
    │   └── page.tsx             # Главная (редирект)
    ├── components/
    │   ├── ui/                  # Авто-генерируемые shadcn-компоненты
    │   ├── AuthTabs.tsx         # Переключатель вход/регистрация
    │   ├── LoginForm.tsx
    │   ├── RegisterForm.tsx
    │   ├── TaskModal.tsx        # Модальное окно создания/редактирования задачи
    │   ├── TaskStatusFilter.tsx # Фильтр задач по статусу
    │   ├── LogoutButton.tsx
    │   └── QueryProvider.tsx    # TanStack Query Provider
    ├── hooks/
    │   ├── useTasks.ts          # TanStack Query хуки для задач
    │   └── useTasksSocket.ts    # WebSocket-подписка на обновления
    ├── lib/
    │   ├── actions/
    │   │   └── auth.ts          # Server Actions для авторизации
    │   └── api/
    │       ├── tasks.ts         # Серверные функции получения задач
    │       └── tasks-client.ts  # Клиентские fetch-функции для мутаций
    ├── .env
    └── package.json
```

---

## Модели данных

**User**
- `id` — UUID
- `email` — уникальный
- `password` — bcrypt-хэш
- `createdAt`

**Task**
- `id` — UUID
- `title`
- `description` — опционально
- `status` — `TODO | IN_PROGRESS | DONE`
- `createdAt`, `updatedAt`
- `userId` — связь с User (cascade delete)

---

## Локальный запуск

### Требования
- Node.js 20+
- Bun (для фронтенда)
- PostgreSQL

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd test
```

### 2. Настроить Backend

```bash
cd back
npm install
```

Создать `.env` (или отредактировать существующий):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/crm-test?schema=public"
PORT=3001
JWT_SECRET="your-secret-key"
```

Запустить миграции и сгенерировать Prisma Client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Запустить сервер в режиме разработки:

```bash
npm run start:dev
```

API будет доступен на `http://localhost:3001`.  
WebSocket (Socket.io) на том же порту.

### 3. Настроить Frontend

```bash
cd ../front
bun install
```

Создать `.env` (или отредактировать существующий):

```env
API_URL=http://localhost:3001
```

Запустить в режиме разработки:

```bash
bun run dev
```

Приложение будет доступно на `http://localhost:3000`.

---

## API эндпоинты

### Auth

| Метод | Путь | Описание |
|---|---|---|
| POST | `/auth/register` | Регистрация нового пользователя |
| POST | `/auth/login` | Вход, возвращает JWT-токен |

### Tasks (требуется JWT)

| Метод | Путь | Описание |
|---|---|---|
| GET | `/tasks` | Получить все задачи текущего пользователя |
| POST | `/tasks` | Создать задачу |
| PATCH | `/tasks/:id` | Обновить задачу (title, description, status) |
| DELETE | `/tasks/:id` | Удалить задачу |

### WebSocket

Сервер эмитит событие `task:status_changed` при изменении статуса задачи:

```json
{
  "taskId": "uuid",
  "status": "IN_PROGRESS",
  "timestamp": "2026-06-19T10:00:00.000Z"
}
```

---

## Скрипты

### Backend

```bash
npm run start:dev   # Режим разработки с hot-reload
npm run build       # Сборка production
npm run start:prod  # Запуск production-сборки
npm run test        # Unit-тесты
npm run test:e2e    # E2E-тесты
```

### Frontend

```bash
bun run dev         # Режим разработки
bun run build       # Production-сборка
bun run start       # Запуск production-сборки
bun run lint        # Линтинг
```
