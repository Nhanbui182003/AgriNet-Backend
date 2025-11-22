import { Injectable } from '@nestjs/common';
import { LoginRequestDto } from './dto/requests/auth-login.request.dto';
import { HttpBadRequestError } from '@app/common/errors/bad-request.error';
import { UsersService } from '../users/users.service';
import { ErrorCode } from '@app/common/errors';
import * as bcrypt from 'bcrypt';
import * as ms from 'ms';
import { UserStatus } from '../users/enums/user-status.enum';
import { UserRole } from '../users/enums/user-role.enum';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigKeys } from '@app/config/config-key.enum';
import { AuthLoginResponseDto } from './dto/responses/auth-login.resonse.dto';
import { ChangePasswordRequestDto } from './dto/requests/change-password.request.dto';
import { ForgotPasswordRequestDto } from './dto/requests/forgot-password,request.dto';
import { PasswordGenerator } from '@app/utils/password-generator';
import { EmailService } from '@app/services/email/email.service';
import { SignUpByGuestRequestDto } from './dto/requests/sign-up-by-guest.request.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly emailService: EmailService,
	) {}

	async login(body: LoginRequestDto): Promise<AuthLoginResponseDto> {
		const { email, password } = body;
		const user = await this.userService.findOne({ email: email });
		if (!user) {
			throw new HttpBadRequestError(ErrorCode.INCORRECT_EMAIL_PASSWORD);
		}
		if (!user.password) {
			throw new HttpBadRequestError(ErrorCode.INCORRECT_EMAIL_PASSWORD);
		}
		if (!user.email) {
			throw new HttpBadRequestError(ErrorCode.INCORRECT_EMAIL_PASSWORD);
		}
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw new HttpBadRequestError(ErrorCode.INCORRECT_EMAIL_PASSWORD);
		}
		if (user.status !== UserStatus.ACTIVE) {
			throw new HttpBadRequestError(ErrorCode.USER_IN_ACTIVE);
		}

		const profile = await this.userService.findProfile(user);

		const tokenData = await this.generateToken({
			id: user.id,
			role: user.role,
			phone: user.phone || '',
			email: user.email,
			status: user.status,
		});
		return {
			accessToken: tokenData.accessToken,
			expiredIn: tokenData.expiredIn,
			profile,
		};
	}

	private async generateToken(data: {
		id: string;
		role: UserRole;
		phone?: string;
		email?: string;
		status: UserStatus;
	}): Promise<{ accessToken: string; expiredIn: number }> {
		const accessTokenExpiresIn = this.configService.get(ConfigKeys.JWT_EXPIRES);
		const secret = this.configService.get(ConfigKeys.JWT_SECRET);
		const tokenExpires = ms(accessTokenExpiresIn as ms.StringValue);

		const accessToken = await this.jwtService.signAsync(
			{
				id: data.id,
				role: data.role,
				email: data.email,
				phone: data.phone,
				status: data.status,
			},
			{
				secret,
				expiresIn: tokenExpires,
			},
		);

		return {
			accessToken,
			expiredIn: tokenExpires,
		};
	}

	async changePassword(userId: string, input: ChangePasswordRequestDto) {
		const user = await this.userService.findOneById(userId);
		if (!user) {
			throw new HttpBadRequestError(ErrorCode.USER_NOT_FOUND);
		}

		const isValidPassword = await bcrypt.compare(
			input.oldPassword,
			user.password!,
		);
		if (!isValidPassword) {
			throw new HttpBadRequestError(ErrorCode.INCORRECT_CURRENT_PASSWORD);
		}

		const hashedNewPassword = await bcrypt.hash(input.newPassword, 10);

		user.password = hashedNewPassword;
		await this.userService.updateUser(user.id, { password: hashedNewPassword });

		return { message: 'Password changed successfully' };
	}

	async resetPassword(input: any) {
		console.log(input);
		return true;
	}

	async forgotPassword(input: ForgotPasswordRequestDto) {
		const user = await this.userService.findOne({ email: input.email });
		if (!user) {
			throw new HttpBadRequestError(ErrorCode.USER_NOT_FOUND);
		}

		if (user.status !== UserStatus.ACTIVE) {
			throw new HttpBadRequestError(ErrorCode.USER_IN_ACTIVE);
		}

		const password = PasswordGenerator.generateStrong();
		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		await this.userService.updateUser(user.id, { password: hashedPassword });

		void this.emailService.sendMail({
			to: user.email!,
			subject: 'Forgot Password',
			html: `Your new password is ${password}`,
		});

		return {
			message: 'New password has been sent to your email',
		};
	}
}
