import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import {
	HttpResponseError,
	ResponseStatus,
} from '@app/common/interfaces/response.interface';
import * as TEXT from '@app/common/constants/text.constant';
import { AllConfigType } from '@app/config/config.type';

@Injectable()
export class OriginMiddleware implements NestMiddleware {
	constructor(private configService: ConfigService<AllConfigType>) {}

	use(request: Request, response: Response, next: NextFunction) {
		// production only
		if (
			this.configService.get('app.nodeEnv', { infer: true }) === 'production'
		) {
			const { origin, referer } = request.headers;
			const isAllowed = (field: string | undefined) =>
				!field ||
				this.configService
					.get('app.crossDomain.allowedReferer', { infer: true })!
					.some((item) => field.includes(item));

			const isAllowedOrigin = isAllowed(origin);
			const isAllowedReferer = isAllowed(referer);

			if (!isAllowedOrigin && !isAllowedReferer) {
				return response.status(HttpStatus.UNAUTHORIZED).jsonp({
					status: ResponseStatus.Error,
					message: TEXT.HTTP_ANONYMOUS_TEXT,
					error: null,
				} as HttpResponseError);
			}
		}

		return next();
	}
}
