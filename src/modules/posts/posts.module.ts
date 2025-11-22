import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './posts.repository';
import { Post } from './entities/post.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Post])],
	controllers: [PostsController],
	providers: [PostsService, PostRepository],
	exports: [PostsService],
})
export class PostsModule {}
