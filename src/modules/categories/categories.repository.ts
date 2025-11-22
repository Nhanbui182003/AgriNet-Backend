import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@app/common/bases/base.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
	constructor(dataSource: DataSource) {
		super(Category, dataSource);
	}
}
