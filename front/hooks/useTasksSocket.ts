"use client"

import { useEffect } from "react"
import { io } from "socket.io-client"
import type { TaskStatus } from "@/lib/api/tasks"

export interface TaskStatusChangedPayload {
  taskId: string
  status: TaskStatus
  timestamp: string
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001"

export function useTasksSocket(
  onStatusChanged: (payload: TaskStatusChangedPayload) => void
) {
  useEffect(() => {
    const socket = io(WS_URL, { transports: ["websocket"] })

    socket.on("task:status_changed", (payload: TaskStatusChangedPayload) => {
      onStatusChanged(payload)
    })

    return () => {
      socket.disconnect()
    }
  }, [onStatusChanged])
}
