import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
	columnCreatedAt,
	columnDeletedAt,
	columnId,
	columnUpdatedAt,
} from '../constants/columns.constant';

export class CreateCategoriesTable1763772917131 implements MigrationInterface {
	private readonly tableName = 'Categories';
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					columnId,
					{
						name: 'name',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'image',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'description',
						type: 'text',
						isNullable: true,
					},
					columnCreatedAt,
					columnUpdatedAt,
					columnDeletedAt,
				],
			}),
			false,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable(this.tableName);
	}
}
