import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@app/modules/posts/entities/post.entity';
import { PostsSeedService } from './posts-seed.service';
import { PostEmbedding } from '@app/modules/post-embeddings/entities/post-embedding.entity';
import { Category } from '@app/modules/categories/entities/category.entity';
import { User } from '@app/modules/users/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Post, PostEmbedding, Category, User])],
	providers: [PostsSeedService],
	exports: [PostsSeedService],
})
export class PostsSeedModule {}
