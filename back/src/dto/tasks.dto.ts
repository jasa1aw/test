import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { TaskStatus } from '../../generated/prisma/enums'

export class CreateTaskDto {
	@IsString()
	@IsNotEmpty({ message: 'Поле «Название» не должно оставаться пустым' })
	title: string

	@IsOptional()
	@IsString()
	description?: string
}

export class UpdateTaskDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty({ message: 'Поле «Название» не должно оставаться пустым' })
	title?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus
}
