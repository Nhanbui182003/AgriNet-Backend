import { Module } from '@nestjs/common';
import { PostEmbeddingsService } from './post-embeddings.service';
import { PostEmbeddingsController } from './post-embeddings.controller';

@Module({
  controllers: [PostEmbeddingsController],
  providers: [PostEmbeddingsService],
})
export class PostEmbeddingsModule {}
