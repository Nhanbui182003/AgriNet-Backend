import { PaginationDto } from '@app/common/dtos/paginationDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetMyPostRequestDto extends PaginationDto {
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	categoryId?: string;
}
