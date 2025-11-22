import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './posts.repository';
import { Post } from './entities/post.entity';
import { PostImage } from '../post-images/entities/post-image.entity';
import { PostImageRepository } from '../post-images/post-images.repository';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([Post, PostImage]), UsersModule],
	controllers: [PostsController],
	providers: [PostsService, PostRepository, PostImageRepository],
	exports: [PostsService],
})
export class PostsModule {}
