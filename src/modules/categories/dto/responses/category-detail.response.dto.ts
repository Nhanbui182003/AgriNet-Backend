import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CategoryDetailResponseDto {
	@Expose()
	id: string;

	@Expose()
	name: string;

	@Expose()
	image: string;
}
