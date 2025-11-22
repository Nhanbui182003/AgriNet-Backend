import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetRecommendPostRequestDto {
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	categoryName: string;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	productName: string;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	price: string;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	quantity: string;

	@ApiProperty({ type: Number, required: false })
	@IsNumber()
	@IsOptional()
	@Transform(({ value }) => (value ? Number(value) : undefined))
	latitude?: number;

	@ApiProperty({ type: Number, required: false })
	@IsNumber()
	@IsOptional()
	@Transform(({ value }) => (value ? Number(value) : undefined))
	longitude?: number;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	address: string;
}
