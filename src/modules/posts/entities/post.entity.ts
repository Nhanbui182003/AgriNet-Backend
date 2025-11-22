import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
} from 'typeorm';

import { EntityHelper } from '@app/utils/entity-helper';
import { PostStatus } from '../enums/post-status.enum';
import { Category } from '@app/modules/categories/entities/category.entity';
import { User } from '@app/modules/users/entities/user.entity';
import { PostImage } from '@app/modules/post-images/entities/post-image.entity';
import { PostEmbedding } from '@app/modules/post-embeddings/entities/post-embedding.entity';

@Entity({ name: 'Posts' })
export class Post extends EntityHelper {
	@Column({ type: 'uuid', nullable: false, unique: true })
	title: string;

	@Column({ type: 'text', nullable: false })
	content: string;

	@Column({ type: 'uuid', nullable: true })
	categoryId: string;

	@Column({ type: 'uuid', nullable: false })
	userId: string;

	@Column({ type: 'int', nullable: false, default: PostStatus.ACTIVE })
	status: PostStatus;

	@Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
	latitude?: number;

	@Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
	longitude?: number;

	@Column({ type: 'varchar', nullable: true })
	address?: string;

	@ManyToOne(() => Category, (category) => category.posts)
	@JoinColumn({ name: 'categoryId' })
	category: Category;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn({ name: 'userId' })
	user: User;

	@OneToMany(() => PostImage, (postImage) => postImage.post)
	images: PostImage[];

	@OneToOne(() => PostEmbedding, (postEmbedding) => postEmbedding.post)
	embedding: PostEmbedding;
}
