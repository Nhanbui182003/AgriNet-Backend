import {
	Body,
	Controller,
	Get,
	MaxFileSizeValidator,
	ParseFilePipe,
	Patch,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Responser } from '@app/common/decorators/responser.decorator';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UserRole } from './enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { toDto } from '@app/common/transformers/dto.transformer';
import { UserProfileResponseDto } from './dto/responses/user-profile.response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from '@app/utils/file-config';
import { SingleFileValidationPipe } from '@app/common/transformers/single-file-validation-pipe';
import { UpdateProfileRequestDto } from './dto/requests/update-profile.request.dto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('upload-avatar')
	@UseInterceptors(
		FileInterceptor('file', { storage: storageConfig('avatars') }),
	)
	@Responser.handle('Upload avatar')
	@ApiBearerAuth()
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ description: 'Upload avatar' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@UseGuards(AuthGuard)
	async uploadAvatar(
		@UploadedFile(SingleFileValidationPipe) file: Express.Multer.File,
		@CurrentUser() user: User,
	) {
		const data = await this.usersService.uploadAvatar(user.id, file.filename);
		return toDto(UserProfileResponseDto, data);
	}

	@Get('profile')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[ALL ROLES] Get profile' })
	@Responser.handle('Get profile')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.SUPER_ADMIN, UserRole.FARMER, UserRole.CUSTOMER)
	async getProfile(@CurrentUser() user: User) {
		const data = await this.usersService.findProfile(user);
		return toDto(UserProfileResponseDto, data);
	}

	@Patch('update-profile')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[ALL ROLES] Update profile' })
	@Responser.handle('Update profile')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.SUPER_ADMIN, UserRole.FARMER, UserRole.CUSTOMER)
	async updateProfile(
		@CurrentUser() user: User,
		@Body() updateProfileDto: UpdateProfileRequestDto,
	) {
		const data = await this.usersService.updateProfile(
			user.id,
			updateProfileDto,
		);
		return toDto(UserProfileResponseDto, data);
	}
}
