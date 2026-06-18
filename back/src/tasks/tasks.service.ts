import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTaskDto, UpdateTaskDto } from '../dto/tasks.dto'

@Injectable()
export class TasksService {
	constructor(private readonly prisma: PrismaService) { }

	findAll(userId: string) {
		return this.prisma.task.findMany({
			where: { userId },
			orderBy: { createdAt: 'desc' },
		})
	}

	async create(userId: string, dto: CreateTaskDto) {
		return this.prisma.task.create({
			data: { ...dto, userId },
		})
	}

	async update(userId: string, id: string, dto: UpdateTaskDto) {
		await this.ensureOwner(userId, id)
		return this.prisma.task.update({
			where: { id },
			data: dto,
		})
	}

	async remove(userId: string, id: string) {
		await this.ensureOwner(userId, id)
		await this.prisma.task.delete({ where: { id } })
		return {
			message: 'Тест успешно удален',
			status: 'success'
		}
	}

	private async ensureOwner(userId: string, id: string) {
		const task = await this.prisma.task.findUnique({ where: { id } })
		if (!task) throw new NotFoundException(`Task ${id} not found`)
		if (task.userId !== userId) throw new ForbiddenException()
	}
}
