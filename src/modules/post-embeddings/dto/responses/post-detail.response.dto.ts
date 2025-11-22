import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PostEmbeddingDetailResponseDto {
	@Expose()
	id: string;

	@Expose()
	productName: string;

	@Expose()
	price: string;

	@Expose()
	quantity: string;
}
