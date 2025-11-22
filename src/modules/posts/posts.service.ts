import { Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { GetMyPostRequestDto } from './dto/requests/get-my-post.request.dto';
import { CreatePostRequestDto } from './dto/requests/create-post.request.dto';
import { PostImageRepository } from '../post-images/post-images.repository';

@Injectable()
export class PostsService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly postImageRepository: PostImageRepository,
	) {}

	async getMyPost(userId: string, getMyPostRequestDto: GetMyPostRequestDto) {
		const queryBuilder = this.postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.category', 'category')
			.leftJoinAndSelect('post.user', 'user')
			.leftJoinAndSelect('post.images', 'images')
			.leftJoinAndSelect('post.embedding', 'embedding')
			.where('post.userId = :userId', { userId: userId });

		if (getMyPostRequestDto.categoryId) {
			queryBuilder.andWhere('post.categoryId = :categoryId', {
				categoryId: getMyPostRequestDto.categoryId,
			});
		}
		queryBuilder.orderBy('post.createdAt', 'DESC');

		return await this.postRepository.paginate(
			queryBuilder,
			getMyPostRequestDto,
		);
	}

	async createPost(userId: string, createPostRequestDto: CreatePostRequestDto) {
		const post = this.postRepository.create({
			title: createPostRequestDto.title,
			content: createPostRequestDto.content,
			userId: userId,
		});

		const savedPost = await this.postRepository.save(post);

		if (createPostRequestDto.images) {
			for (const image of createPostRequestDto.images) {
				await this.postImageRepository.save(
					this.postImageRepository.create({
						postId: savedPost.id,
						url: image,
					}),
				);
			}
		}
		return savedPost;
	}
}
