import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../utils/base';
import { UserEntity } from '../user/user.entity';
import { VideoEntity } from '../video/video.entity';

@Entity('comment')
export class CommentEntity extends Base {
	@Column({ type: 'text' })
	message: string;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;

	@ManyToOne(() => VideoEntity, (video) => video.comments)
	@JoinColumn({ name: 'video_id' })
	video: VideoEntity;
}
