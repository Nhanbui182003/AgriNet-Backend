import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/requests/auth-login.request.dto';
import { Responser } from '@app/common/decorators/responser.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthLoginResponseDto } from './dto/responses/auth-login.resonse.dto';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { AuthGuard } from './guard/auth.guard';
import { ChangePasswordRequestDto } from './dto/requests/change-password.request.dto';
import { User } from '../users/entities/user.entity';
import { ForgotPasswordRequestDto } from './dto/requests/forgot-password,request.dto';
import { SignUpByGuestRequestDto } from './dto/requests/sign-up-by-guest.request.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@ApiOperation({ summary: '[PUBLIC] Login' })
	@Responser.handle('login')
	async login(
		@Body() loginDto: LoginRequestDto,
	): Promise<AuthLoginResponseDto> {
		return await this.authService.login(loginDto);
	}

	@Post('change-password')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[ALL ROLES] Change password' })
	@Responser.handle('Change password')
	@UseGuards(AuthGuard)
	async changePassword(
		@Body() input: ChangePasswordRequestDto,
		@CurrentUser() user: User,
	) {
		return await this.authService.changePassword(user.id, input);
	}

	@Post('forgot-password')
	@ApiOperation({ summary: '[PUBLIC] Forgot password' })
	@Responser.handle('Forgot password')
	async forgotPassword(@Body() input: ForgotPasswordRequestDto) {
		return await this.authService.forgotPassword(input);
	}
}
