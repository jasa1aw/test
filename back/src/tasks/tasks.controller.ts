import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/jwtAuth.guard'
import { CreateTaskDto, UpdateTaskDto } from '../dto/tasks.dto'

interface AuthRequest extends Express.Request {
  user: { id: string; email: string }
}

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.tasksService.findAll(req.user.id)
  }

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.id, dto)
  }

  @Patch(':id')
  update(@Request() req: AuthRequest, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(req.user.id, id, dto)
  }

  @Delete(':id')
  remove(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.tasksService.remove(req.user.id, id)
  }
}
