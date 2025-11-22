import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
// import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/modules/users/entities/user.entity';
import { UserRole } from '@app/modules/users/enums/user-role.enum';
import { UserStatus } from '@app/modules/users/enums/user-status.enum';
import { customers, farmers } from '@app/database/data/users';

@Injectable()
export class UserSeedService {
	constructor(
		@InjectRepository(User) private UsersRepository: Repository<User>,
	) {}

	async run(): Promise<void> {
		await this.fakeSuperAdmin();
		await this.fakeFarmers();
		await this.fakeCustomers();
		console.log('✅Users seeded successfully');
	}

	private async fakeSuperAdmin(): Promise<void> {
		const user = await this.UsersRepository.create({
			firstName: 'Super',
			lastName: 'Admin',
			email: 'admin@gmail.com',
			password: await bcrypt.hash('123qwe!@#', 10),
			phone: '0909090909',
			role: UserRole.SUPER_ADMIN,
			status: UserStatus.ACTIVE,
		});

		await this.UsersRepository.save(user);
	}

	private async fakeFarmers(): Promise<void> {
		for (const farmer of farmers) {
			await this.UsersRepository.save(
				this.UsersRepository.create({
					...farmer,
					password: await bcrypt.hash('123qwe!@#', 10),
				}),
			);
		}
	}

	private async fakeCustomers(): Promise<void> {
		for (const customer of customers) {
			await this.UsersRepository.save(
				this.UsersRepository.create({
					...customer,
					password: await bcrypt.hash('123qwe!@#', 10),
				}),
			);
		}
	}
}
