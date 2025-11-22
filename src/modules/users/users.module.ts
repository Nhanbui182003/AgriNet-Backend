import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { IsNotExist } from '@app/utils/validators/is-not-exists.validator';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		HttpModule.registerAsync({
			useFactory: () => ({
				timeout: 20000,
				maxRedirects: 5,
			}),
		}),
	],
	controllers: [UsersController],
	providers: [UsersService, UserRepository, IsNotExist],
	exports: [UsersService],
})
export class UsersModule {}
