import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { VideoDto } from './dto/video.dto';
import { CurrentUser } from '../user/decorators/user.decorator';

@Controller('video')
export class VideoController {
	constructor(private readonly videoService: VideoService) {}

	@Get('get-private/:id')
	@Auth()
	getPrivateVideo(@Param('id') id: string) {
		return this.videoService.findById(+id);
	}

	@Get()
	getAll(@Query('search') searchTerm?: string) {
		return this.videoService.getAll(searchTerm);
	}

	@Get('most-popular')
	getMostPopularByViews() {
		return this.videoService.getMostPopularByViews();
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.videoService.findById(+id);
	}

	@HttpCode(200)
	@Post()
	@Auth()
	createVideo(@CurrentUser('id') userId: number) {
		return this.videoService.create(userId);
	}

	@HttpCode(200)
	@Put(':id')
	@Auth()
	@UsePipes(new ValidationPipe())
	updateVideo(@Param('id') id: string, @Body() dto: VideoDto) {
		return this.videoService.update(+id, dto);
	}

	@Delete(':id')
	@Auth()
	deleteVideo(@Param('id') id: string) {
		return this.videoService.delete(+id);
	}

	@HttpCode(200)
	@Put('update-views/:videoId')
	updateViews(@Param('videoId') videoId: string) {
		return this.videoService.updateCountViews(+videoId);
	}

	@HttpCode(200)
	@Put('update-likes/:videoId')
	@Auth()
	updateLikes(@Param('videoId') videoId: string) {
		return this.videoService.updateReactions(+videoId);
	}
}
