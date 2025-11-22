import { Controller } from '@nestjs/common';
import { PostEmbeddingsService } from './post-embeddings.service';

@Controller('post-embeddings')
export class PostEmbeddingsController {
  constructor(private readonly postEmbeddingsService: PostEmbeddingsService) {}
}
