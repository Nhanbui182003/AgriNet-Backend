import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comments.repository';
import { CreateCommentRequestDto } from './dto/requests/create-comment.request.dto';
import { ErrorCode, HttpNotFoundError } from '@app/common/errors';
import { PostsService } from '../posts/posts.service';
import { GetCommentRequestDto } from './dto/requests/get-comment.request.dto';

@Injectable()
export class CommentsService {
	constructor(
		private readonly commentRepository: CommentRepository,
		private readonly postService: PostsService,
	) {}

	async create(
		userId: string,
		createCommentRequestDto: CreateCommentRequestDto,
	) {
		const post = await this.postService.findOne(createCommentRequestDto.postId);
		if (!post) {
			throw new HttpNotFoundError(ErrorCode.POST_NOT_FOUND);
		}

		const parentComment = await this.commentRepository.findOne({
			where: { id: createCommentRequestDto.parentCommentId },
		});

		if (!parentComment) {
			throw new HttpNotFoundError(ErrorCode.COMMENT_NOT_FOUND);
		}

		const comment = await this.commentRepository.save(
			this.commentRepository.create({
				userId,
				...createCommentRequestDto,
			}),
		);

		return comment;
	}

	async getComments(getCommentRequestDto: GetCommentRequestDto) {
		const queryBuilder = this.commentRepository
			.createQueryBuilder('comment')
			.leftJoinAndSelect('comment.post', 'post')
			.leftJoinAndSelect('comment.user', 'user')
			.leftJoinAndSelect('comment.childComments', 'childComments')
			.leftJoinAndSelect('childComments.user', 'childCommentsUser')
			.where('comment.postId = :postId', {
				postId: getCommentRequestDto.postId,
			})
			.andWhere('comment.parentCommentId IS NULL')
			.orderBy('comment.createdAt', 'DESC');

		return await this.commentRepository.paginate(
			queryBuilder,
			getCommentRequestDto,
		);
	}
}
