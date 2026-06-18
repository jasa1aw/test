import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, LoginDto } from '../dto/auth.dto'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto, @Res() res: Response) {
		return this.authService.login(dto, res)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Res() res: Response) {
		return this.authService.logout(res)
	}
}
