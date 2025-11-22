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

export class CreatePostEmbeddingsTable1763779844063
	implements MigrationInterface
{
	private readonly tableName = 'PostEmbeddings';
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
						name: 'productName',
						type: 'varchar',
					},
					{
						name: 'price',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'quantity',
						type: 'varchar',
						isNullable: true,
					},
					columnCreatedAt,
					columnUpdatedAt,
					columnDeletedAt,
				],
			}),
		);

		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_PostEmbeddings_Posts',
				columnNames: ['postId'],
				referencedTableName: 'Posts',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey(this.tableName, 'FK_PostEmbeddings_Posts');
		await queryRunner.dropTable(this.tableName);
	}
}
