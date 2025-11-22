import { UserProfileResponseDto } from '@app/modules/users/dto/responses/user-profile.response.dto';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class AuthLoginResponseDto {
	@Expose()
	accessToken: string;

	@Expose()
	expiredIn: number;

	@Expose()
	@Type(() => UserProfileResponseDto)
	profile: UserProfileResponseDto;
}
