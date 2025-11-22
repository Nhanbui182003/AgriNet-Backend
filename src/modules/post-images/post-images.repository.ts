import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@app/common/bases/base.repository';
import { PostImage } from './entities/post-image.entity';

@Injectable()
export class PostImageRepository extends BaseRepository<PostImage> {
	constructor(dataSource: DataSource) {
		super(PostImage, dataSource);
	}
}
