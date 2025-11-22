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

export class CreateCommentsTable1763799159114 implements MigrationInterface {
	private readonly tableName = 'Comments';
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
						name: 'userId',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'parentCommentId',
						type: 'uuid',
						isNullable: true,
					},
					{
						name: 'content',
						type: 'text',
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
				name: 'FK_Comments_Posts',
				columnNames: ['postId'],
				referencedTableName: 'Posts',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);

		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_Comments_Users',
				columnNames: ['userId'],
				referencedTableName: 'Users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);

		await queryRunner.createForeignKey(
			this.tableName,
			new TableForeignKey({
				name: 'FK_Comments_ParentComments',
				columnNames: ['parentCommentId'],
				referencedTableName: 'Comments',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey(this.tableName, 'FK_Comments_Posts');
		await queryRunner.dropForeignKey(this.tableName, 'FK_Comments_Users');
		await queryRunner.dropForeignKey(
			this.tableName,
			'FK_Comments_ParentComments',
		);
		await queryRunner.dropTable(this.tableName);
	}
}
