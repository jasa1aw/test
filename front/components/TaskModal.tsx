"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "progress" | "done"
  updated: string
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "delete"
  task?: Task
  onSubmit?: (taskData: { title: string; description: string; status: "todo" | "progress" | "done" }) => void
  onDelete?: (id: string) => void
}

export function TaskModal({
  isOpen,
  onClose,
  mode,
  task,
  onSubmit,
  onDelete,
}: TaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"todo" | "progress" | "done">("todo")

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && task) {
        setTitle(task.title)
        setDescription(task.description)
        setStatus(task.status)
      } else {
        setTitle("")
        setDescription("")
        setStatus("todo")
      }
    }
  }, [isOpen, mode, task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "delete") {
      if (onDelete && task) {
        onDelete(task.id)
      }
    } else {
      if (!title.trim()) return
      if (onSubmit) {
        onSubmit({
          title: title.trim(),
          description: description.trim(),
          status,
        })
      }
    }
    onClose()
  }

  if (mode === "delete") {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-[440px] rounded-2xl p-6 bg-white border border-[#e5e7eb] shadow-xl">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-lg font-bold text-[#111111]">
              Удалить задачу?
            </DialogTitle>
            <DialogDescription className="text-sm text-[#6b7280] mt-1 leading-normal">
              Вы действительно хотите удалить задачу{" "}
              <span className="font-semibold text-[#111111]">
                «{task?.title}»
              </span>
              ? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border-[#e5e7eb] text-[#6b7280] hover:text-[#111111] hover:bg-[#f9fafb] rounded-lg text-sm font-semibold cursor-pointer h-9"
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (onDelete && task) {
                  onDelete(task.id)
                }
                onClose()
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold cursor-pointer h-9"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] rounded-2xl p-6 bg-white border border-[#e5e7eb] shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#111111]">
            {mode === "create" ? "Новая задача" : "Редактировать задачу"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title" className="text-xs font-semibold text-[#111111]">
              Название задачи <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              required
              placeholder="Введите название задачи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-full bg-[#f9fafb] border-[#e5e7eb] rounded-lg px-3 py-2 text-sm placeholder:text-[#9ca3af] text-[#111111] focus-visible:ring-1 focus-visible:ring-[#6366f1] focus-visible:border-[#6366f1] transition-colors outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc" className="text-xs font-semibold text-[#111111]">
              Описание
            </Label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Добавьте описание..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm placeholder:text-[#9ca3af] text-[#111111] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6366f1] focus-visible:border-[#6366f1] transition-colors resize-none outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#111111]">
              Статус
            </Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val) setStatus(val as "todo" | "progress" | "done")
              }}
            >
              <SelectTrigger className="h-9 w-full bg-[#f9fafb] border-[#e5e7eb] rounded-lg text-sm text-[#111111] focus-visible:ring-1 focus-visible:ring-[#6366f1] focus-visible:border-[#6366f1] outline-none">
                <SelectValue>
                  {status === "todo" && "К выполнению"}
                  {status === "progress" && "В процессе"}
                  {status === "done" && "Выполнено"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#e5e7eb] rounded-lg shadow-md">
                <SelectItem value="todo" className="text-sm text-[#111111] hover:bg-[#f9fafb] cursor-pointer">
                  К выполнению
                </SelectItem>
                <SelectItem value="progress" className="text-sm text-[#111111] hover:bg-[#f9fafb] cursor-pointer">
                  В процессе
                </SelectItem>
                <SelectItem value="done" className="text-sm text-[#111111] hover:bg-[#f9fafb] cursor-pointer">
                  Выполнено
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 flex flex-row justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border-[#e5e7eb] text-[#6b7280] hover:text-[#111111] hover:bg-[#f9fafb] rounded-lg text-sm font-semibold cursor-pointer h-9"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] disabled:opacity-50 text-white rounded-lg text-sm font-semibold cursor-pointer h-9"
            >
              {mode === "create" ? "Создать задачу" : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
