import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('get-all')
	getUsers() {
		return this.userService.getAll();
	}

	@Get('profile')
	@Auth()
	getProfile(@CurrentUser('id') id: number) {
		return this.userService.findById(id);
	}

	@Get('by-id/:id')
	getUser(@Param('id') id: string) {
		return this.userService.findById(+id);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	updateUser(@Param('id') id: string, @Body() dto: UserDto) {
		return this.userService.updateProfile(+id, dto);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('subscribe/:channelId')
	@Auth()
	subscribeToChannel(
		@CurrentUser('id') userId: string,
		@Param('channelId') channelId: string,
	) {
		return this.userService.subscribe(+userId, +channelId);
	}
}
