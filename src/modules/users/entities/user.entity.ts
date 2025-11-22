import { Column, Entity, OneToMany } from 'typeorm';

import { EntityHelper } from '@app/utils/entity-helper';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Post } from '@app/modules/posts/entities/post.entity';
import { Comment } from '@app/modules/comments/entities/comment.entity';

@Entity({ name: 'Users' })
export class User extends EntityHelper {
	@Column({ type: 'uuid', nullable: false, unique: true })
	email: string;

	@Column({ type: 'varchar', nullable: false })
	password: string;

	@Column({ type: 'varchar', nullable: false })
	firstName: string;

	@Column({ type: 'varchar', nullable: false })
	lastName: string;

	@Column({ type: 'varchar', nullable: true, unique: true })
	phone?: string;

	@Column({ type: 'varchar', nullable: true })
	avatar?: string;

	@Column({ type: 'int', nullable: false })
	role: UserRole;

	@Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
	latitude?: number;

	@Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
	longitude?: number;

	@Column({ type: 'varchar', nullable: true })
	address?: string;

	@Column({ type: 'int', nullable: false, default: UserStatus.ACTIVE })
	status: UserStatus;

	@OneToMany(() => Post, (post) => post.user)
	posts: Post[];

	@OneToMany(() => Comment, (comment) => comment.user)
	comments: Comment[];
}
