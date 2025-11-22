import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Delete,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostRequestDto } from './dto/requests/create-post.request.dto';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Responser } from '@app/common/decorators/responser.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PostDetailResponseDto } from './dto/responses/post-detail.response.dto';
import {
	toDto,
	toDtos,
	toPaginateDtos,
} from '@app/common/transformers/dto.transformer';
import { GetMyPostRequestDto } from './dto/requests/get-my-post.request.dto';
import { storageConfig } from '@app/utils/file-config';
import { FileInterceptor } from '@nestjs/platform-express';
import { SingleFileValidationPipe } from '@app/common/transformers/single-file-validation-pipe';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '@app/config/config-key.enum';
import { UpdatePostRequestDto } from './dto/requests/update-post.request.dto';
import { GetRecommendPostRequestDto } from './dto/requests/get-recommend-post.request.dto';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly configService: ConfigService,
	) {}

	@Get()
	@ApiOperation({ summary: '[PUBLIC] List post' })
	@Responser.handle('List post')
	async listPost(@Query() input: GetRecommendPostRequestDto) {
		const data = await this.postsService.listPost(input);
		return toDtos(PostDetailResponseDto, data);
	}

	@Get('list-my-post')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[FARMER] List my post' })
	@Responser.handle('List my post')
	@Responser.paginate()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.FARMER)
	async listMyPost(
		@CurrentUser() user: User,
		@Query() getMyPostRequestDto: GetMyPostRequestDto,
	) {
		const data = await this.postsService.getMyPost(
			user.id,
			getMyPostRequestDto,
		);
		return toPaginateDtos(PostDetailResponseDto, data);
	}

	@Post('upload-post-image')
	@UseInterceptors(FileInterceptor('file', { storage: storageConfig('posts') }))
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
	) {
		const fileUrl =
			this.configService.get(ConfigKeys.BACKEND_DOMAIN, { infer: true }) +
			'/public/posts/' +
			file.filename;

		return {
			filename: file.filename,
			fileUrl: fileUrl,
		};
	}

	@Post('create')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[FARMER] Create post' })
	@Responser.handle('Create post')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.FARMER)
	async createPost(
		@CurrentUser() user: User,
		@Body() createPostRequestDto: CreatePostRequestDto,
	) {
		const data = await this.postsService.createPost(
			user.id,
			createPostRequestDto,
		);
		return toDto(PostDetailResponseDto, data);
	}

	@Get(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[ALL ROLES] Get post detail' })
	@Responser.handle('Get post detail')
	async getPostDetail(@Param('id') id: string) {
		const data = await this.postsService.getPostDetail(id);
		return toDto(PostDetailResponseDto, data);
	}

	@Patch(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[FARMER] Update post' })
	@Responser.handle('Update post')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.FARMER)
	async updatePost(
		@Param('id') id: string,
		@Body() updatePostRequestDto: UpdatePostRequestDto,
	) {
		const data = await this.postsService.updatePost(id, updatePostRequestDto);
		return toDto(PostDetailResponseDto, data);
	}

	@Delete(':id')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[FARMER] Delete post' })
	@Responser.handle('Delete post')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.FARMER)
	async deletePost(@CurrentUser() user: User, @Param('id') id: string) {
		return await this.postsService.deletePost(user.id, id);
	}
}
