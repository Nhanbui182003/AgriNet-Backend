import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';
import {
	columnCreatedAt,
	columnDeletedAt,
	columnId,
	columnUpdatedAt,
} from '../constants/columns.constant';
import { PostStatus } from '@app/modules/posts/enums/post-status.enum';

export class CreatePostsTable1763774393258 implements MigrationInterface {
	private readonly tableName = 'Posts';
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					columnId,
					{
						name: 'title',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'content',
						type: 'text',
					},
					{
						name: 'categoryId',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'userId',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'status',
						type: 'int',
						isNullable: false,
						default: PostStatus.ACTIVE,
					},
					{
						name: 'latitude',
						type: 'decimal',
						precision: 10,
						scale: 8,
						isNullable: true,
					},
					{
						name: 'longitude',
						type: 'decimal',
						precision: 11,
						scale: 8,
						isNullable: true,
					},
					{
						name: 'address',
						type: 'varchar',
						isNullable: true,
					},
					columnCreatedAt,
					columnUpdatedAt,
					columnDeletedAt,
				],
			}),
			false,
		);

		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_Posts_Categories',
				columnNames: ['categoryId'],
				referencedTableName: 'Categories',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);

		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_Posts_Users',
				columnNames: ['userId'],
				referencedTableName: 'Users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey(this.tableName, 'FK_Posts_Categories');
		await queryRunner.dropForeignKey(this.tableName, 'FK_Posts_Users');
		await queryRunner.dropTable(this.tableName);
	}
}
