import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Responser } from '@app/common/decorators/responser.decorator';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '@app/common/decorators/current-user.decorator';
import { CreateCommentRequestDto } from './dto/requests/create-comment.request.dto';
import { CommentDetailResponseDto } from './dto/responses/comment-detail.response.dto';
import {
	toDto,
	toPaginateDtos,
} from '@app/common/transformers/dto.transformer';
import { GetCommentRequestDto } from './dto/requests/get-comment.request.dto';

@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@Post('create')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[ALL ROLES] Create comment' })
	@Responser.handle('Create comment')
	@UseGuards(AuthGuard)
	async createComment(
		@CurrentUser() user: User,
		@Body() createCommentRequestDto: CreateCommentRequestDto,
	) {
		const data = await this.commentsService.create(
			user.id,
			createCommentRequestDto,
		);
		return toDto(CommentDetailResponseDto, data);
	}

	@Get('list-comment')
	@ApiBearerAuth()
	@ApiOperation({ summary: '[PUBLIC] List comment' })
	@Responser.handle('List comment')
	async listComment(@Query() getCommentRequestDto: GetCommentRequestDto) {
		const data = await this.commentsService.getComments(getCommentRequestDto);
		return toPaginateDtos(CommentDetailResponseDto, data);
	}
}
