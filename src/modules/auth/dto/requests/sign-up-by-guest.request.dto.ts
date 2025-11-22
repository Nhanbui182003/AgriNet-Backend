import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignUpByGuestRequestDto {
	@ApiProperty({ type: String, example: '0987654321' })
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	phone: string;
}
