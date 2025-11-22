import { Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { GetMyPostRequestDto } from './dto/requests/get-my-post.request.dto';
import { CreatePostRequestDto } from './dto/requests/create-post.request.dto';
import { PostImageRepository } from '../post-images/post-images.repository';
import {
	ErrorCode,
	HttpForbiddenError,
	HttpNotFoundError,
} from '@app/common/errors';
import { UpdatePostRequestDto } from './dto/requests/update-post.request.dto';
import { GetAllPostRequestDto } from './dto/requests/get-all-post.request.dto';

@Injectable()
export class PostsService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly postImageRepository: PostImageRepository,
	) {}

	async listPost(getAllPostRequestDto: GetAllPostRequestDto) {
		const queryBuilder = this.postRepository
			.createQueryBuilder('post')
			.leftJoinAndSelect('post.category', 'category')
			.leftJoinAndSelect('post.user', 'user')
			.leftJoinAndSelect('post.images', 'images')
			.leftJoinAndSelect('post.embedding', 'embedding');

		if (getAllPostRequestDto.categoryId) {
			queryBuilder.andWhere('post.categoryId = :categoryId', {
				categoryId: getAllPostRequestDto.categoryId,
			});
		}
		queryBuilder.orderBy('post.createdAt', 'DESC');

		return await this.postRepository.paginate(
			queryBuilder,
			getAllPostRequestDto,
		);
	}

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
			latitude: createPostRequestDto.latitude,
			longitude: createPostRequestDto.longitude,
			address: createPostRequestDto.address,
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

	async findOne(id: string) {
		return await this.postRepository.findOne({
			where: { id },
		});
	}

	async getPostDetail(id: string) {
		const post = await this.postRepository.findOne({
			where: { id },
			relations: ['images', 'embedding', 'category', 'user'],
		});

		return post;
	}

	async updatePost(id: string, updatePostRequestDto: UpdatePostRequestDto) {
		const { images, ...body } = updatePostRequestDto;

		const post = await this.postRepository.findOne({
			where: { id },
		});
		if (!post) {
			throw new HttpNotFoundError(ErrorCode.POST_NOT_FOUND);
		}

		if (updatePostRequestDto.images) {
			await this.postImageRepository.delete({ postId: post.id });

			for (const image of updatePostRequestDto.images) {
				await this.postImageRepository.save(
					this.postImageRepository.create({
						postId: post.id,
						url: image,
					}),
				);
			}
		}

		Object.assign(post, body);

		return await this.postRepository.save(post);
	}

	async deletePost(userId: string, id: string) {
		const post = await this.postRepository.findOne({
			where: { id },
		});

		if (!post) {
			throw new HttpNotFoundError(ErrorCode.POST_NOT_FOUND);
		}

		if (post.userId !== userId) {
			throw new HttpForbiddenError(ErrorCode.INVALID_PERMISSION);
		}

		return await this.postRepository.softDelete(id);
	}
}
