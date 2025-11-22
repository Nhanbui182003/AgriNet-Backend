/**
 * @file Error interceptor
 * @module interceptor/error
 */

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { getResponserOptions } from '@app/common/decorators/responser.decorator';
import * as TEXT from '@app/common/constants/text.constant';
import {
	CustomError,
	HttpBadRequestError,
	HttpForbiddenError,
	HttpNotFoundError,
	HttpUnauthorizedError,
	ValidationError,
} from '@app/common/errors';
import { TelegramService } from '@app/services/telegram/telegram.service';

/**
 * @class ErrorInterceptor
 * @classdesc catch error when controller Promise rejected
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
	constructor(private readonly telegramService: TelegramService) {}

	isInternalException(error) {
		return ![
			ValidationError.name,
			HttpBadRequestError.name,
			HttpForbiddenError.name,
			HttpNotFoundError.name,
			HttpUnauthorizedError.name,
		].includes(error.name);
	}

	async sendMessage(request, error) {
		return this.telegramService.handleRequestError(
			request.method,
			request.url,
			request.body,
			error,
		);
	}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> {
		const call$ = next.handle();
		const target = context.getHandler();
		const { errorCode, errorMessage } = getResponserOptions(target);
		const request = context.switchToHttp().getRequest<Request>();
		return call$.pipe(
			catchError((error) => {
				if (this.isInternalException(error)) {
					this.sendMessage(request, error);
				}

				return throwError(
					() =>
						new CustomError(
							{ message: errorMessage || TEXT.HTTP_DEFAULT_ERROR_TEXT, error },
							error instanceof HttpException ? error.getStatus() : errorCode,
						),
				);
			}),
		);
	}
}
