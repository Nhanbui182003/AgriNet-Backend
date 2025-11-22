import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@app/common/bases/base.repository';
import { Post } from './entities/post.entity';

@Injectable()
export class PostRepository extends BaseRepository<Post> {
	constructor(dataSource: DataSource) {
		super(Post, dataSource);
	}
}
