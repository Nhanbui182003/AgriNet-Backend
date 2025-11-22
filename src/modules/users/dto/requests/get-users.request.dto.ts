import { PaginationDto } from '@app/common/dtos/paginationDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

export class GetUsersRequestDto extends PaginationDto {
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({
		type: Number,
		description:
			'1: Super admin, 2: Booster admin, 3: Worker, 4: Manager, 5: Treasurer, 6: Customer, 7: Guest',
		enum: UserRole,
		required: false,
	})
	@IsEnum(UserRole)
	@IsOptional()
	role?: UserRole;
}
