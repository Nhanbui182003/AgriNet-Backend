import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './posts.repository';
import { Post } from './entities/post.entity';
import { PostImage } from '../post-images/entities/post-image.entity';
import { PostImageRepository } from '../post-images/post-images.repository';
import { UsersModule } from '../users/users.module';
import { HttpModule } from '@nestjs/axios';
import { Category } from '../categories/entities/category.entity';
import { CategoryRepository } from '../categories/categories.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([Post, PostImage, Category]),
		UsersModule,
		HttpModule.registerAsync({
			useFactory: () => ({
				timeout: 10000,
				maxRedirects: 5,
			}),
		}),
	],
	controllers: [PostsController],
	providers: [
		PostsService,
		PostRepository,
		PostImageRepository,
		CategoryRepository,
	],
	exports: [PostsService],
})
export class PostsModule {}
