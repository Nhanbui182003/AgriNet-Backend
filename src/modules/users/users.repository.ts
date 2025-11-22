import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@app/common/bases/base.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
	constructor(dataSource: DataSource) {
		super(User, dataSource);
	}
}
