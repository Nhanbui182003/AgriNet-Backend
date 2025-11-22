import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../../enums/user-role.enum';
import { UserStatus } from '../../enums/user-status.enum';

@Exclude()
export class UserProfileResponseDto {
	@Expose()
	id: string;

	@Expose()
	email: string;

	@Expose()
	firstName: string;

	@Expose()
	lastName: string;

	@Expose()
	phone: string;

	@Expose()
	avatar: string;

	@Expose()
	latitude: number;

	@Expose()
	longitude: number;

	@Expose()
	address: string;

	@Expose()
	role: UserRole;

	@Expose()
	status: UserStatus;
}
