import { Column, Entity, OneToMany } from 'typeorm';

import { EntityHelper } from '@app/utils/entity-helper';
import { Post } from '@app/modules/posts/entities/post.entity';

@Entity({ name: 'Categories' })
export class Category extends EntityHelper {
	@Column({ type: 'uuid', nullable: false, unique: true })
	name: string;

	@Column({ type: 'varchar', nullable: true })
	image: string;

	@Column({ type: 'varchar', nullable: true })
	description: string;

	@OneToMany(() => Post, (post) => post.category)
	posts: Post[];
}
