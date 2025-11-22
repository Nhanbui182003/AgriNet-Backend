import { PaginationDto } from '@app/common/dtos/paginationDto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCommentRequestDto extends PaginationDto {
	@ApiProperty({ type: String, required: true })
	@IsString()
	@IsNotEmpty()
	postId: string;
}
