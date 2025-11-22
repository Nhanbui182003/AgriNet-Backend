import { Request } from 'express';
import { User } from '@app/modules/users/entities/user.entity';
import { UserRole } from '@app/modules/users/enums/user-role.enum';
import { UserStatus } from '@app/modules/users/enums/user-status.enum';

export interface AuthRequest extends Request {
	user: User;
}

export interface TokenPayload {
	id: string;
	email: string;
	role: UserRole;
	status: UserStatus;
}
