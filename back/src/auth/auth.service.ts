import {
	Injectable,
	ConflictException,
	UnauthorizedException,
	BadRequestException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from '../dto/auth.dto'
import { LoginDto } from '../dto/auth.dto'
import { Response } from 'express'


@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
	) { }

	async register(dto: RegisterDto) {
		const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
		if (existing) throw new ConflictException('Пользователь с таким email уже существует')

		const hash = await bcrypt.hash(dto.password, 10)
		const user = await this.prisma.user.create({
			data: { email: dto.email, password: hash },
		})

		return { id: user.id, email: user.email }
	}


	async login(dto: LoginDto, res: Response) {
		const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
		if (!user) throw new UnauthorizedException('Неверный email или пароль')

		const passValid = await bcrypt.compare(dto.password, user.password)
		if (!passValid) throw new UnauthorizedException('Неверный email или пароль')

		const token = this.jwtService.sign({ id: user.id, email: user.email })
		res.cookie('token', token, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60 * 1000,
		})
		return res.json({
			message: 'Вход выполнен успешно',
			accessToken: token
		})
	}

	async logout(res: Response) {
		res.clearCookie('token')
		return res.json({
			message: 'Выход выполнен успешно',
		})
	}

}

