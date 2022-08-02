import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../comment/comment.entity';
import { VideoEntity } from './video.entity';
import { UserEntity } from '../user/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([VideoEntity, CommentEntity, UserEntity])],
	controllers: [VideoController],
	providers: [VideoService],
})
export class VideoModule {}
