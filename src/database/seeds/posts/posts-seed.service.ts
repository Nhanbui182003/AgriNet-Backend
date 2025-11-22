import { Repository } from 'typeorm';
// import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@app/modules/posts/entities/post.entity';
import { PostEmbedding } from '@app/modules/post-embeddings/entities/post-embedding.entity';
import { posts } from '@app/database/data/posts';
import { Category } from '@app/modules/categories/entities/category.entity';
import { User } from '@app/modules/users/entities/user.entity';

@Injectable()
export class PostsSeedService {
	constructor(
		@InjectRepository(Post) private PostsRepository: Repository<Post>,
		@InjectRepository(PostEmbedding)
		private PostEmbeddingsRepository: Repository<PostEmbedding>,
		@InjectRepository(Category)
		private CategoriesRepository: Repository<Category>,
		@InjectRepository(User) private UsersRepository: Repository<User>,
	) {}

	async run(): Promise<void> {
		await this.fakePosts();
		console.log('✅Posts seeded successfully');
	}

	private async fakePosts(): Promise<void> {
		for (const post of posts) {
			const category = await this.CategoriesRepository.findOne({
				where: { name: post.categoryName },
			});

			if (!category) {
				throw new Error(`Category ${post.categoryName} not found`);
			}

			const user = await this.UsersRepository.findOne({
				where: { email: post.customerEmail },
			});

			if (!user) {
				throw new Error(`User ${post.customerEmail} not found`);
			}

			const newPost = await this.PostsRepository.save(
				await this.PostsRepository.create({
					title: post.title,
					content: post.content,
					categoryId: category.id,
					userId: user.id,
					status: post.status,
					latitude: user.latitude,
					longitude: user.longitude,
					address: user.address,
				}),
			);

			await this.PostEmbeddingsRepository.save(
				await this.PostEmbeddingsRepository.create({
					postId: newPost.id,
					productName: post.productName,
					price: post.price,
					quantity: post.quantity,
				}),
			);
		}
	}
}
