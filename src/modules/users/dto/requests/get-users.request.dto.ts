import { PaginationDto } from '@app/common/dtos/paginationDto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class GetUsersRequestDto extends PaginationDto {
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({
		type: Number,
		description: '2: Customer, 3: Farmer',
		enum: UserRole,
		required: false,
	})
	@Transform(({ value }) => (value ? Number(value) : undefined))
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole;
}
