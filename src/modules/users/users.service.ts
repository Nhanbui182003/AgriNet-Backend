import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from './entities/user.entity';
import { EntityCondition } from '@app/common/types/entity-condition.type';
import { NullableType } from '@app/common/types/nullable.type';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UserProfileResponseDto } from './dto/responses/user-profile.response.dto';
import { ErrorCode, HttpNotFoundError } from '@app/common/errors';
import { toDto } from '@app/common/transformers/dto.transformer';
import { EmailService } from '@app/services/email/email.service';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@app/config/config-key.enum';
import { UpdateProfileRequestDto } from './dto/requests/update-profile.request.dto';

@Injectable()
export class UsersService {
	constructor(
		private readonly usersRepository: UserRepository,
		private readonly configService: ConfigService,
		private readonly emailService: EmailService,
	) {}

	async findOne(
		fields: EntityCondition<User>,
		relations?: Record<string, boolean>,
	): Promise<NullableType<User>> {
		const query: any = { where: fields };
		if (relations) {
			query.relations = relations;
		}
		return await this.usersRepository.findOne({ ...query });
	}

	async findOneById(
		id: string | null | undefined,
		relations?: Record<string, boolean>,
	): Promise<NullableType<User>> {
		if (!id) {
			return null;
		}
		return await this.usersRepository.findOne({
			where: { id },
			...(relations ? { relations } : {}),
		});
	}

	async findBy(option): Promise<User[]> {
		return await this.usersRepository.findBy(option);
	}

	async updateUser(id: string, data: QueryDeepPartialEntity<User>) {
		return await this.usersRepository.update({ id }, data);
	}

	async findProfile(user: User): Promise<UserProfileResponseDto> {
		const userData = await this.usersRepository.findOne({
			where: { id: user.id },
		});
		if (!userData) {
			throw new HttpNotFoundError(ErrorCode.USER_NOT_FOUND);
		}

		return toDto(UserProfileResponseDto, userData);
	}

	async uploadAvatar(userId: string, filename: string) {
		const user = await this.usersRepository.findOne({ where: { id: userId } });
		user!.avatar =
			this.configService.get(ConfigKeys.BACKEND_DOMAIN, { infer: true }) +
			'/public/avatars/' +
			filename;

		return this.usersRepository.save(user!);
	}

	async updateProfile(id: string, updateProfileDto: UpdateProfileRequestDto) {
		const user = await this.usersRepository.findOne({ where: { id } });
		if (!user) {
			throw new HttpNotFoundError(ErrorCode.USER_NOT_FOUND);
		}

		return await this.updateUser(id, updateProfileDto);
	}
}
