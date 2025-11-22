import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { EntityHelper } from '@app/utils/entity-helper';
import { Post } from '@app/modules/posts/entities/post.entity';

@Entity({ name: 'PostEmbeddings' })
export class PostEmbedding extends EntityHelper {
	@Column({ type: 'uuid', nullable: false })
	postId: string;

	@Column({ type: 'varchar', nullable: false })
	productName: string;

	@Column({ type: 'varchar', nullable: true })
	price?: string;

	@Column({ type: 'varchar', nullable: true })
	quantity?: string;

	@OneToOne(() => Post, (post) => post.embedding)
	@JoinColumn({ name: 'postId' })
	post: Post;
}
