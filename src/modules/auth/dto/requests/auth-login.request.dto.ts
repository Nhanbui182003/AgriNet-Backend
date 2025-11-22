import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginRequestDto {
	@ApiProperty({ type: String, example: 'le.huu.anh84@example.com' })
	@IsNotEmpty()
	@IsEmail()
	@IsString()
	@Transform(({ value }) => value.toLowerCase())
	email: string;

	@ApiProperty({ type: String, example: '123qwe!@#' })
	@IsNotEmpty()
	@IsString()
	password: string;
}
