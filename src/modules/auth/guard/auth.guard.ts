import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { UsersService } from '@app/modules/users/users.service';
import { HttpUnauthorizedError } from '@app/common/errors';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new HttpUnauthorizedError();
		}
		try {
			const decodeToken = this.jwtService.verify(token);
			const user = await this.usersService.findOne({
				email: decodeToken.email,
			});
			if (!user) {
				throw new HttpUnauthorizedError();
			}
			request.user = user;
		} catch {
			throw new HttpUnauthorizedError();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
