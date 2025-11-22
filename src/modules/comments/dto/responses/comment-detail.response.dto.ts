import { Exclude, Expose } from 'class-transformer';
import { UserProfileResponseDto } from '@app/modules/users/dto/responses/user-profile.response.dto';
import { Type } from 'class-transformer';
import { TransformToUtc } from '@app/common/transformers/date.transformer';

@Exclude()
export class CommentDetailResponseDto {
	@Expose()
	id: string;

	@Expose()
	content: string;

	@Expose()
	@TransformToUtc()
	createdAt: Date;

	@Expose()
	@TransformToUtc()
	updatedAt: Date;

	@Expose()
	@TransformToUtc()
	deletedAt: Date;

	@Expose()
	@Type(() => CommentDetailResponseDto)
	childComments: CommentDetailResponseDto[];

	@Expose()
	@Type(() => UserProfileResponseDto)
	user: UserProfileResponseDto;
}
