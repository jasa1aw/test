"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Pencil, Trash2, ClipboardList } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type TaskStatus = "all" | "todo" | "progress" | "done"

interface Task {
  id: string
  title: string
  description: string
  status: Exclude<TaskStatus, "all">
  updated: string
}

const TASKS: Task[] = [
  {
    id: "1",
    title: "Разработать API для авторизации",
    description: "JWT-аутентификация с refresh-токенами",
    status: "todo",
    updated: "19 июн 2026"
  },
  {
    id: "2",
    title: "Написать unit-тесты для модуля задач",
    description: "CRUD-операции и валидация данных",
    status: "todo",
    updated: "18 июн 2026"
  },
  {
    id: "3",
    title: "Исправить баг #47 в форме загрузки",
    description: "Ошибка при загрузке файлов >10 МБ на iOS",
    status: "progress",
    updated: "19 июн 2026"
  },
  {
    id: "4",
    title: "Добавить тёмную тему интерфейса",
    description: "Переключение с сохранением в localStorage",
    status: "progress",
    updated: "17 июн 2026"
  },
  {
    id: "5",
    title: "Обновить README-документацию",
    description: "Инструкции по деплою и настройке окружения",
    status: "todo",
    updated: "16 июн 2026"
  },
  {
    id: "6",
    title: "Деплой версии 2.0 на продакшн",
    description: "Обновление сервера, миграции БД",
    status: "done",
    updated: "14 июн 2026"
  },
  {
    id: "7",
    title: "Провести код-ревью PR #23",
    description: "Реализация системы уведомлений",
    status: "done",
    updated: "12 июн 2026"
  }
]

const STATUS_FILTERS: { value: TaskStatus; label: string; dotColor: string }[] = [
  { value: "all",       label: "Все",           dotColor: "bg-[#6b7280]" },
  { value: "todo",      label: "К выполнению",  dotColor: "bg-[#6b7280]" },
  { value: "progress",  label: "В процессе",    dotColor: "bg-[#f59e0b]" },
  { value: "done",      label: "Выполнено",     dotColor: "bg-[#22c55e]" },
]

const STATUS_BADGE: Record<Exclude<TaskStatus, "all">, { label: string; className: string }> = {
  todo:      { label: "К выполнению", className: "bg-[#6b7280]/10 text-[#6b7280]" },
  progress:  { label: "В процессе",   className: "bg-[#f59e0b]/12 text-[#d97706]" },
  done:      { label: "Выполнено",    className: "bg-[#22c55e]/12 text-[#16a34a]" },
}

export function TaskStatusFilter() {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>("all")
  const [query, setQuery] = useState("")

  const filtered = TASKS.filter((t) => {
    const matchStatus = activeStatus === "all" || t.status === activeStatus
    const matchQuery  = !query || 
      t.title.toLowerCase().includes(query.toLowerCase()) || 
      t.description.toLowerCase().includes(query.toLowerCase())
    return matchStatus && matchQuery
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] size-3.5" />
          <Input
            className="h-8 w-56 pl-9 pr-3 text-xs border border-[#e5e7eb] rounded-lg bg-white placeholder:text-[#9ca3af] text-[#111111] focus-visible:ring-1 focus-visible:ring-[#6366f1] focus-visible:border-[#6366f1] transition-colors"
            placeholder="Поиск по названию..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant="outline"
              onClick={() => setActiveStatus(f.value)}
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                activeStatus === f.value
                  ? "bg-[#6366f1] border-[#6366f1] text-white hover:bg-[#6366f1] hover:text-white"
                  : "bg-transparent border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111111]"
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", f.dotColor, activeStatus === f.value && "bg-white")} />
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-[#e5e7eb] hover:bg-transparent">
              <TableHead className="text-[11px] font-semibold text-[#8a92a6] tracking-wider uppercase pb-3.5 pt-1 px-3 text-left">
                Название
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-[#8a92a6] tracking-wider uppercase pb-3.5 pt-1 px-3 text-left">
                Статус
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-[#8a92a6] tracking-wider uppercase pb-3.5 pt-1 px-3 text-left">
                Обновлено
              </TableHead>
              <TableHead className="text-[11px] font-semibold text-[#8a92a6] tracking-wider uppercase pb-3.5 pt-1 px-3 text-right">
                Действия
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-14 text-center text-[#8a92a6] text-sm">
                  <ClipboardList className="mx-auto mb-3 opacity-30 size-9" />
                  Нет задач, соответствующих фильтру
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((task) => {
                const status = STATUS_BADGE[task.status]
                return (
                  <TableRow key={task.id} className="border-b border-[#e5e7eb] hover:bg-[#f3f4f6]/40 transition-colors">
                    <TableCell className="py-3.5 px-3 max-w-[400px] whitespace-normal">
                      <div className="text-sm font-semibold text-[#111111] hover:text-[#6366f1] transition-colors cursor-pointer leading-tight">
                        {task.title}
                      </div>
                      <div className="text-xs text-[#8a92a6] mt-1 font-normal leading-normal">
                        {task.description}
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5 px-3">
                      <span className={cn("flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold leading-normal", status.className)}>
                        {status.label}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 px-3 text-xs text-[#6b7280] font-normal">
                      {task.updated}
                    </TableCell>

                    <TableCell className="py-3.5 px-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Button 
                          variant="ghost"
                          size="icon-xs"
                          className="text-[#8a92a6] hover:text-[#6366f1] hover:bg-slate-100/60 cursor-pointer" 
                          title="Редактировать"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon-xs"
                          className="text-[#8a92a6] hover:text-red-500 hover:bg-red-50 cursor-pointer" 
                          title="Удалить"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

