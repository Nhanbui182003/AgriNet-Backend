import { Repository } from 'typeorm';
// import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@app/modules/categories/entities/category.entity';
import { categories } from '@app/database/data/categories';

@Injectable()
export class CategoriesSeedService {
	constructor(
		@InjectRepository(Category)
		private CategoriesRepository: Repository<Category>,
	) {}

	async run(): Promise<void> {
		await this.fakeCategories();
		console.log('✅Categories seeded successfully');
	}

	private async fakeCategories(): Promise<void> {
		for (const category of categories) {
			await this.CategoriesRepository.save(
				this.CategoriesRepository.create(category),
			);
		}
	}
}
