import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryDetailResponseDto } from '@app/modules/categories/dto/responses/category-detail.response.dto';
import { UserProfileResponseDto } from '@app/modules/users/dto/responses/user-profile.response.dto';
import { PostImagesDetailResponseDto } from '@app/modules/post-images/dto/responses/post-images-detail.response.dto';
import { PostEmbeddingDetailResponseDto } from '@app/modules/post-embeddings/dto/responses/post-detail.response.dto';

@Exclude()
export class PostDetailResponseDto {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	content: string;

	@Expose()
	@Type(() => CategoryDetailResponseDto)
	category: CategoryDetailResponseDto;

	@Expose()
	@Type(() => UserProfileResponseDto)
	user: UserProfileResponseDto;

	@Expose()
	@Type(() => PostImagesDetailResponseDto)
	images: PostImagesDetailResponseDto[];

	@Expose()
	@Type(() => PostEmbeddingDetailResponseDto)
	embedding: PostEmbeddingDetailResponseDto;
}
