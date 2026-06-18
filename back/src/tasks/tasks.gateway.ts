import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { TaskStatus } from '../../generated/prisma/enums'

export interface TaskStatusChangedPayload {
  taskId: string
  status: TaskStatus
  timestamp: string
}

@WebSocketGateway({ cors: { origin: '*' } })
export class TasksGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(TasksGateway.name)

  afterInit() {
    this.logger.log('WebSocket gateway initialized')
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  emitTaskStatusChanged(payload: TaskStatusChangedPayload) {
    this.server.emit('task:status_changed', payload)
  }
}
