import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreatePostRequestDto {
	@ApiProperty({ type: String, required: true })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ type: String, required: true })
	@IsString()
	@IsNotEmpty()
	content: string;

	@ApiProperty({ type: [String], required: true })
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	images?: string[];

	@ApiProperty({ type: Number, required: true })
	@IsNumber()
	@IsNotEmpty()
	latitude: number;

	@ApiProperty({ type: Number, required: true })
	@IsNumber()
	@IsNotEmpty()
	longitude: number;

	@ApiProperty({ type: String, required: true })
	@IsString()
	@IsNotEmpty()
	address: string;
}
