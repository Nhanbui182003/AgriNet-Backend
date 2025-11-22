import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { EntityHelper } from '@app/utils/entity-helper';
import { Post } from '@app/modules/posts/entities/post.entity';
import { User } from '@app/modules/users/entities/user.entity';

@Entity({ name: 'Comments' })
export class Comment extends EntityHelper {
	@Column({ type: 'uuid', nullable: true })
	parentCommentId: string;

	@Column({ type: 'uuid', nullable: false })
	postId: string;

	@Column({ type: 'uuid', nullable: false })
	userId: string;

	@Column({ type: 'text', nullable: false })
	content: string;

	@ManyToOne(() => Post, (post) => post.comments)
	@JoinColumn({ name: 'postId' })
	post: Post;

	@ManyToOne(() => User, (user) => user.comments)
	@JoinColumn({ name: 'userId' })
	user: User;

	@ManyToOne(() => Comment, (comment) => comment.childComments)
	@JoinColumn({ name: 'parentCommentId' })
	parentComment: Comment;

	@OneToMany(() => Comment, (comment) => comment.parentComment)
	childComments: Comment[];
}
