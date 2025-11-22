import { Exclude, Expose, Type } from 'class-transformer';
import { CategoryDetailResponseDto } from '@app/modules/categories/dto/responses/category-detail.response.dto';
import { UserProfileResponseDto } from '@app/modules/users/dto/responses/user-profile.response.dto';
import { PostImagesDetailResponseDto } from '@app/modules/post-images/dto/responses/post-images-detail.response.dto';
import { PostEmbeddingDetailResponseDto } from '@app/modules/post-embeddings/dto/responses/post-detail.response.dto';
import { PostStatus } from '../../enums/post-status.enum';

@Exclude()
export class PostDetailResponseDto {
	@Expose()
	id: string;

	@Expose()
	title: string;

	@Expose()
	content: string;

	@Expose()
	status: PostStatus;

	@Expose()
	latitude: number;

	@Expose()
	longitude: number;

	@Expose()
	address: string;

	@Expose()
	createdAt: Date;

	@Expose()
	updatedAt: Date;

	@Expose()
	deletedAt: Date;

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
