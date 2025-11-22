import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import {
	Injectable,
	NestMiddleware,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from '@app/common/interfaces/auth-request.interface';
import { UsersService } from '@app/modules/users/users.service';
import { UserStatus } from '@app/modules/users/enums/user-status.enum';

const EXCLUDE_PATHS = [];

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {}

	async use(req: AuthRequest, res: Response, next: NextFunction) {
		if (
			EXCLUDE_PATHS.some((path: string) => {
				const [method, route] = path.split(' ');
				return req.method === method && req.route.path === route;
			})
		) {
			return next();
		}

		const token = this.extractTokenFromHeader(req);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const decodeToken = this.jwtService.verify(token);
			const user = await this.usersService.findOne({
				email: decodeToken.email,
			});
			if (!user) {
				throw new UnauthorizedException(
					'Your account does not exist, please contact the admin',
				);
			}
			if (user.status !== UserStatus.ACTIVE) {
				throw new UnauthorizedException(
					'Your account has been inactive or reject',
				);
			}

			req.user = user;
			next();
		} catch (error) {
			console.log(error);
			throw new UnauthorizedException(
				'Your account does not exist, please contact the admin',
			);
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
