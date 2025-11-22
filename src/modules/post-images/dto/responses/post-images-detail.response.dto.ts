import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PostImagesDetailResponseDto {
	@Expose()
	id: string;

	@Expose()
	fileName: string;

	@Expose()
	url: string;
}
