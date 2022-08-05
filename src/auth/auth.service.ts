import {
	BadRequestException,
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { compare, hash, genSalt } from 'bcryptjs';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: AuthDto) {
		const oldUser = await this.userRepository.findOne({
			where: { email: dto.email },
		});

		if (oldUser)
			throw new BadRequestException('Пользователь с таким Email существует');

		const salt = await genSalt(10);

		const newUser = await this.userRepository.create({
			email: dto.email,
			password: await hash(dto.password, salt),
		});

		const user = await this.userRepository.save(newUser);

		return {
			user: this.returnUserFields(user),
			accessToken: await this.generateToken(user.id),
		};
	}

	async login(dto: AuthDto) {
		const user = await this.validateUser(dto);

		return {
			user: this.returnUserFields(user),
			accessToken: await this.generateToken(user.id),
		};
	}

	/**
	 * Ниже находятся вспомогательные функции для AuthService
	 */

	async validateUser(dto: AuthDto) {
		const user = await this.userRepository.findOne({
			where: { email: dto.email },
			select: ['id', 'email', 'password'],
		});

		if (!user)
			throw new HttpException(
				'Пользователь с таким Email существует',
				HttpStatus.NOT_FOUND,
			);

		const isValidPassword = await compare(dto.password, user.password);

		if (!isValidPassword) throw new UnauthorizedException('Пароль неверный');

		return user;
	}

	async generateToken(userId: number) {
		const data = { userId };

		return await this.jwtService.signAsync(data, {
			expiresIn: '31d',
		});
	}

	returnUserFields(user: UserEntity) {
		return {
			id: user.id,
			email: user.email,
		};
	}
}
