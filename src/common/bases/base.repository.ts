import { Injectable } from '@nestjs/common';

import {
	Pagination,
	PaginationParams,
} from '@app/common/types/request-response.type';

import {
	BaseEntity,
	DataSource,
	EntityTarget,
	Repository,
	SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class BaseRepository<E extends BaseEntity> extends Repository<E> {
	constructor(entity: EntityTarget<E>, dataSource: DataSource) {
		super(entity, dataSource.createEntityManager());
	}

	async paginate(
		builder: SelectQueryBuilder<E>,
		paginationParams: PaginationParams,
	): Promise<Pagination<E>> {
		const { page, limit } = paginationParams;
		const [items, total] = await builder
			.take(limit)
			.skip((page - 1) * limit)
			.getManyAndCount();
		return {
			total,
			page,
			limit,
			items: items as E[],
			totalPage: Math.ceil(total / limit),
		};
	}
}
