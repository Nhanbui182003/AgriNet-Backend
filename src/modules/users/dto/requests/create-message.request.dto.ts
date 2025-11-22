import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageRequestDto {
	@ApiProperty({ type: String, required: true })
	@IsString()
	@IsNotEmpty()
	message: string;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	session_id: string;
}
