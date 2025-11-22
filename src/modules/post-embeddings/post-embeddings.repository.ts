import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@app/common/bases/base.repository';
import { PostEmbedding } from './entities/post-embedding.entity';

@Injectable()
export class PostEmbeddingRepository extends BaseRepository<PostEmbedding> {
	constructor(dataSource: DataSource) {
		super(PostEmbedding, dataSource);
	}
}
