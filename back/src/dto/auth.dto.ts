import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class RegisterDto {
	@IsNotEmpty({ message: 'Email обязателен' })
	@IsEmail({}, { message: 'Неверный формат email' })
	@Transform(({ value }) => value?.trim().toLowerCase())
	email: string

	@IsNotEmpty({ message: 'Пароль обязателен' })
	@IsString()
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	password: string
}

export class LoginDto {
	@IsNotEmpty({ message: 'Email обязателен' })
	@IsEmail({}, { message: 'Неверный формат email' })
	@Transform(({ value }) => value?.trim().toLowerCase())
	email: string

	@IsNotEmpty({ message: 'Пароль обязателен' })
	@IsString()
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	password: string
}