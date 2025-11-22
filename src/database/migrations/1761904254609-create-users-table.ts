import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
	columnCreatedAt,
	columnDeletedAt,
	columnId,
	columnUpdatedAt,
} from '../constants/columns.constant';

export class CreateUsersTable1761904254609 implements MigrationInterface {
	private readonly tableName = 'Users';
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: this.tableName,
				columns: [
					columnId,
					{
						name: 'email',
						type: 'varchar',
						isNullable: false,
						isUnique: true,
					},
					{
						name: 'password',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'firstName',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'lastName',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'phone',
						type: 'varchar',
						isNullable: true,
						isUnique: true,
					},
					{
						name: 'avatar',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'role',
						type: 'int',
						isNullable: false,
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
					{
						name: 'status',
						type: 'int',
						isNullable: false,
						default: 1,
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
