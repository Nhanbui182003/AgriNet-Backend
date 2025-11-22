import { TableColumnOptions } from 'typeorm';

// For MySQL
// export const columnId: TableColumnOptions = {
// 	name: 'id',
// 	type: 'varchar',
// 	length: '36',
// 	isPrimary: true,
// 	generationStrategy: 'uuid',
// };

// export const columnCreatedAt: TableColumnOptions = {
// 	name: 'createdAt',
// 	type: 'timestamp',
// 	default: 'CURRENT_TIMESTAMP',
// 	isNullable: false,
// };

// export const columnUpdatedAt: TableColumnOptions = {
// 	name: 'updatedAt',
// 	type: 'timestamp',
// 	default: 'CURRENT_TIMESTAMP',
// 	onUpdate: 'CURRENT_TIMESTAMP',
// 	isNullable: false,
// };

// export const columnDeletedAt: TableColumnOptions = {
// 	name: 'deletedAt',
// 	type: 'timestamp',
// 	isNullable: true,
// };

// For PostgreSQL
export const columnId: TableColumnOptions = {
	name: 'id',
	type: 'uuid',
	isPrimary: true,
	generationStrategy: 'uuid',
	default: `uuid_generate_v4()`,
};

export const columnCreatedAt: TableColumnOptions = {
	name: 'createdAt',
	type: 'timestamp',
	default: 'now()',
};

export const columnUpdatedAt: TableColumnOptions = {
	name: 'updatedAt',
	type: 'timestamp',
	default: 'now()',
};

export const columnDeletedAt: TableColumnOptions = {
	name: 'deletedAt',
	type: 'timestamp',
	isNullable: true,
};
