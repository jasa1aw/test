"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchTasks, apiCreateTask, apiUpdateTask, apiDeleteTask } from "@/lib/api/tasks-client"
import type { Task, TaskStatus } from "@/lib/api/tasks"

export const TASKS_KEY = ["tasks"]

export function useTasks() {
  return useQuery({
    queryKey: TASKS_KEY,
    queryFn: fetchTasks,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiCreateTask,
    onSuccess: (newTask) => {
      const tasks = queryClient.getQueryData<Task[]>(TASKS_KEY) || []
      queryClient.setQueryData(TASKS_KEY, [newTask, ...tasks])
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string; status?: TaskStatus } }) =>
      apiUpdateTask(id, data),
    onSuccess: (updatedTask) => {
      const tasks = queryClient.getQueryData<Task[]>(TASKS_KEY) || []
      queryClient.setQueryData(
        TASKS_KEY,
        tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      )
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: apiDeleteTask,
    onSuccess: (_, id) => {
      const tasks = queryClient.getQueryData<Task[]>(TASKS_KEY) || []
      queryClient.setQueryData(
        TASKS_KEY,
        tasks.filter((t) => t.id !== id)
      )
    },
  })
}
