import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentRequestDto {
	@ApiProperty({ type: String, required: true })
	@IsString()
	@IsNotEmpty()
	postId: string;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	parentCommentId: string;

	@ApiProperty({ type: String, required: true })
	@IsString()
	@IsNotEmpty()
	content: string;
}
