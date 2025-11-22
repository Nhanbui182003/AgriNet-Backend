import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProfileRequestDto {
	@ApiProperty({
		description: 'The first name of the user',
		example: 'John',
	})
	@IsString()
	@IsOptional()
	firstName: string;

	@ApiProperty({
		description: 'The last name of the user',
		example: 'Doe',
	})
	@IsString()
	@IsOptional()
	lastName: string;

	@ApiProperty({
		description: 'The phone number of the user',
		example: '1234567890',
	})
	@IsString()
	@IsOptional()
	phone: string;

	@ApiProperty({
		description: 'The latitude of the user',
		example: 10.7758,
	})
	@IsNumber()
	@IsOptional()
	latitude: number;

	@ApiProperty({
		description: 'The longitude of the user',
		example: 106.6996,
	})
	@IsNumber()
	@IsOptional()
	longitude: number;

	@ApiProperty({
		description: 'The address of the user',
		example: '123 Main St, Anytown, USA',
	})
	@IsString()
	@IsOptional()
	address: string;
}
