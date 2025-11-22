import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { EntityHelper } from '@app/utils/entity-helper';
import { Post } from '@app/modules/posts/entities/post.entity';

@Entity({ name: 'PostImages' })
export class PostImage extends EntityHelper {
	@Column({ type: 'uuid', nullable: false, unique: true })
	postId: string;

	@Column({ type: 'varchar', nullable: true })
	fileName: string;

	@Column({ type: 'varchar', nullable: false })
	url: string;

	@ManyToOne(() => Post, (post) => post.images)
	@JoinColumn({ name: 'postId' })
	post: Post;
}
