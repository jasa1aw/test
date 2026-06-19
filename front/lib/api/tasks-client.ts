import type { Task, TaskStatus } from "./tasks"

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch("/tasks")

  if (!res.ok) {
    throw new Error("Не удалось загрузить задачи")
  }

  return res.json()
}

export async function apiCreateTask(data: { title: string; description: string }): Promise<Task> {
  const res = await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Не удалось создать задачу")
  }

  return res.json()
}

export async function apiUpdateTask(
  id: string,
  data: { title?: string; description?: string; status?: TaskStatus }
): Promise<Task> {
  const res = await fetch(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Не удалось обновить задачу")
  }

  return res.json()
}

export async function apiDeleteTask(id: string): Promise<void> {
  const res = await fetch(`/tasks/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Не удалось удалить задачу")
  }
}
