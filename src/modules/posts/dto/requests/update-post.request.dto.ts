import { ApiProperty } from '@nestjs/swagger';
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { PostStatus } from '../../enums/post-status.enum';
import { Transform } from 'class-transformer';

export class UpdatePostRequestDto {
	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	content?: string;

	@ApiProperty({ type: [String], required: false })
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	images?: string[];

	@ApiProperty({ type: Number, required: false })
	@IsNumber()
	@IsOptional()
	latitude?: number;

	@ApiProperty({ type: Number, required: false })
	@IsNumber()
	@IsOptional()
	longitude?: number;

	@ApiProperty({ type: String, required: false })
	@IsString()
	@IsOptional()
	address?: string;

	@ApiProperty({ type: Number, required: false })
	@Transform(({ value }) => (value ? Number(value) : undefined))
	@IsEnum(PostStatus)
	@IsOptional()
	status?: PostStatus;
}
