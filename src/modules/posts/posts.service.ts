import { Injectable } from '@nestjs/common';
import { PostRepository } from './posts.repository';
import { GetMyPostRequestDto } from './dto/requests/get-my-post.request.dto';
import { CreatePostRequestDto } from './dto/requests/create-post.request.dto';
import { PostImageRepository } from '../post-images/post-images.repository';
import {
	ErrorCode,
	HttpBadRequestError,
	HttpForbiddenError,
	HttpNotFoundError,
} from '@app/common/errors';
import { UpdatePostRequestDto } from './dto/requests/update-post.request.dto';
import { GetAllPostRequestDto } from './dto/requests/get-all-post.request.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CategoryRepository } from '../categories/categories.repository';
import { GetRecommendPostRequestDto } from './dto/requests/get-recommend-post.request.dto';
import { In } from 'typeorm';

@Injectable()
export class PostsService {
	constructor(
		private readonly postRepository: PostRepository,
		private readonly postImageRepository: PostImageRepository,
		private readonly categoryRepository: CategoryRepository,
		private readonly httpService: HttpService,
	) {}

	async listPost(input: GetRecommendPostRequestDto) {
		const response = await firstValueFrom(
			this.httpService.post('http://217.216.72.107:9001/recommend?top_k=30', {
				categoryName: input.categoryName,
				productName: input.productName,
				price: input.price,
				quantity: input.quantity,
				latitude: input.latitude,
				longitude: input.longitude,
				address: input.address,
			}),
		);

		const postIds = response.data.top_results.map((post) => {
			return post.id;
		});

		const posts = await this.postRepository.find({
			where: {
				id: In(postIds),
			},
			relations: ['images', 'embedding', 'category', 'user'],
		});

		return posts;
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
		try {
			const response = await firstValueFrom(
				this.httpService.post(
					'http://217.216.72.107:9001/api/extract-post/extract-post',
					{
						title: createPostRequestDto.title,
						content: createPostRequestDto.content,
					},
				),
			);

			const category = await this.categoryRepository.findOne({
				where: {
					name: response.data.categoryName,
				},
			});

			if (!category) {
				throw new HttpNotFoundError(ErrorCode.CATEGORY_NOT_FOUND);
			}

			const post = this.postRepository.create({
				title: createPostRequestDto.title,
				content: createPostRequestDto.content,
				latitude: createPostRequestDto.latitude,
				longitude: createPostRequestDto.longitude,
				address: createPostRequestDto.address,
				userId: userId,
				categoryId: category.id,
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

			const addItemResponse = await firstValueFrom(
				this.httpService.post('http://217.216.72.107:9001/recommend/add-item', {
					id: savedPost.id,
					title: createPostRequestDto.title,
					content: createPostRequestDto.content,
					latitude: createPostRequestDto.latitude,
					longitude: createPostRequestDto.longitude,
					address: createPostRequestDto.address,
					categoryName: category.name,
					productName: response.data.productName,
					price: response.data.price,
					quantity: response.data.quantity,
				}),
			);
			console.log(addItemResponse.data);

			return savedPost;
		} catch (error) {
			throw new HttpBadRequestError(error.message);
		}
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
