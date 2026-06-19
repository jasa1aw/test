"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Pencil, Trash2, ClipboardList, Plus } from "lucide-react"
import { TaskModal } from "@/components/TaskModal"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks"
import type { Task as ApiTask, TaskStatus as ApiTaskStatus } from "@/lib/api/tasks"
import { useTasksSocket } from "@/hooks/useTasksSocket"
import type { TaskStatusChangedPayload } from "@/hooks/useTasksSocket"
import { useQueryClient } from "@tanstack/react-query"
import { TASKS_KEY } from "@/hooks/useTasks"

type UiStatus = "todo" | "progress" | "done"
type FilterStatus = "all" | UiStatus

interface Task {
  id: string
  title: string
  description: string
  status: UiStatus
  updated: string
}

function toUiStatus(apiStatus: ApiTaskStatus): UiStatus {
  if (apiStatus === "IN_PROGRESS") return "progress"
  if (apiStatus === "DONE") return "done"
  return "todo"
}

function toApiStatus(uiStatus: UiStatus): ApiTaskStatus {
  if (uiStatus === "progress") return "IN_PROGRESS"
  if (uiStatus === "done") return "DONE"
  return "TODO"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function fromApiTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description ?? "",
    status: toUiStatus(t.status),
    updated: formatDate(t.updatedAt),
  }
}

const STATUS_FILTERS: { value: FilterStatus; label: string; dotColor: string }[] = [
  { value: "all",      label: "Все",          dotColor: "bg-[#6b7280]" },
  { value: "todo",     label: "К выполнению", dotColor: "bg-[#6b7280]" },
  { value: "progress", label: "В процессе",   dotColor: "bg-[#f59e0b]" },
  { value: "done",     label: "Выполнено",    dotColor: "bg-[#22c55e]" },
]

const STATUS_BADGE: Record<UiStatus, { label: string; className: string }> = {
  todo:     { label: "К выполнению", className: "bg-[#6b7280]/10 text-[#6b7280]" },
  progress: { label: "В процессе",   className: "bg-[#f59e0b]/12 text-[#d97706]" },
  done:     { label: "Выполнено",    className: "bg-[#22c55e]/12 text-[#16a34a]" },
}

export function TaskStatusFilter() {
  const { data: apiTasks = [], isLoading } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const qc = useQueryClient()

  const [activeStatus, setActiveStatus] = useState<FilterStatus>("all")
  const [query, setQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">("create")
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

  const handleSocketStatusChanged = useCallback(
    (payload: TaskStatusChangedPayload) => {
      qc.setQueryData<ApiTask[]>(TASKS_KEY, (prev = []) =>
        prev.map((t) =>
          t.id === payload.taskId
            ? { ...t, status: payload.status, updatedAt: payload.timestamp }
            : t
        )
      )
    },
    [qc]
  )

  useTasksSocket(handleSocketStatusChanged)

  const handleOpenModal = (mode: "create" | "edit" | "delete", task?: Task) => {
    setModalMode(mode)
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (taskData: {
    title: string
    description: string
    status: UiStatus
  }) => {
    if (modalMode === "create") {
      createTask.mutate(
        { title: taskData.title, description: taskData.description },
        { onSuccess: () => setIsModalOpen(false) }
      )
    } else if (modalMode === "edit" && selectedTask) {
      updateTask.mutate(
        {
          id: selectedTask.id,
          data: {
            title: taskData.title,
            description: taskData.description,
            status: toApiStatus(taskData.status),
          },
        },
        { onSuccess: () => setIsModalOpen(false) }
      )
    }
  }

  const handleModalDelete = (id: string) => {
    deleteTask.mutate(id, { onSuccess: () => setIsModalOpen(false) })
  }

  const tasks = apiTasks.map(fromApiTask)

  const filtered = tasks.filter((t) => {
    const matchStatus = activeStatus === "all" || t.status === activeStatus
    const matchQuery =
      !query ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
    return matchStatus && matchQuery
  })

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      <div className="px-8 pt-5 pb-5 border-b border-[#e5e7eb] shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#111111] tracking-tight leading-none">
            Мои задачи
          </h1>
          <Button
            onClick={() => handleOpenModal("create")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-lg text-sm font-semibold cursor-pointer h-9"
          >
            <Plus className="size-4" />
            Новая задача
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-6">
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
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    f.dotColor,
                    activeStatus === f.value && "bg-white"
                  )}
                />
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-14 text-center text-[#8a92a6] text-sm">
                    Загрузка...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-14 text-center text-[#8a92a6] text-sm">
                    <ClipboardList className="mx-auto mb-3 opacity-30 size-9" />
                    Нет задач, соответствующих фильтру
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((task) => {
                  const badge = STATUS_BADGE[task.status]
                  return (
                    <TableRow
                      key={task.id}
                      className="border-b border-[#e5e7eb] hover:bg-[#f3f4f6]/40 transition-colors"
                    >
                      <TableCell className="py-3.5 px-3 max-w-[400px] whitespace-normal">
                        <div className="text-sm font-semibold text-[#111111] hover:text-[#6366f1] transition-colors cursor-pointer leading-tight">
                          {task.title}
                        </div>
                        <div className="text-xs text-[#8a92a6] mt-1 font-normal leading-normal">
                          {task.description}
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5 px-3">
                        <span
                          className={cn(
                            "flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold leading-normal",
                            badge.className
                          )}
                        >
                          {badge.label}
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
                            onClick={() => handleOpenModal("edit", task)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="text-[#8a92a6] hover:text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Удалить"
                            onClick={() => handleOpenModal("delete", task)}
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        task={selectedTask}
        onSubmit={handleModalSubmit}
        onDelete={handleModalDelete}
      />
    </div>
  )
}
