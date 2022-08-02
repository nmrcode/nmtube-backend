import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('media')
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	@HttpCode(200)
	@Post()
	@Auth()
	@UseInterceptors(FileInterceptor('media'))
	uploadFile(
		@UploadedFile() mediaFile: Express.Multer.File,
		@Query('folder') folder?: string,
	) {
		return this.mediaService.saveMedia(mediaFile, folder);
	}
}
