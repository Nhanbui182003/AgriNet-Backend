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

export class CreatePostImagesTable1763774801015 implements MigrationInterface {
	private readonly tableName = 'PostImages';
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					columnId,
					{
						name: 'postId',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'fileName',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'url',
						type: 'varchar',
						isNullable: false,
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
				name: 'FK_PostImages_Posts',
				columnNames: ['postId'],
				referencedTableName: 'Posts',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey(this.tableName, 'FK_PostImages_Posts');
		await queryRunner.dropTable(this.tableName);
	}
}
