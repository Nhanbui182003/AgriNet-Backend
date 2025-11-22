import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesSeedService } from './categories-seed.service';
import { Category } from '@app/modules/categories/entities/category.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Category])],
	providers: [CategoriesSeedService],
	exports: [CategoriesSeedService],
})
export class CategoriesSeedModule {}
