import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentRepository } from './comments.repository';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
	imports: [TypeOrmModule.forFeature([Comment]), UsersModule, PostsModule],
	controllers: [CommentsController],
	providers: [CommentsService, CommentRepository],
})
export class CommentsModule {}
