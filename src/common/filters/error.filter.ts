import * as lodash from 'lodash';
import { ConfigService } from '@nestjs/config';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import {
	ExceptionInfo,
	HttpResponseError,
	ResponseStatus,
} from '@app/common/interfaces/response.interface';
import { UNDEFINED } from '@app/common/constants/value.constant';
import { Environment } from '@app/config/app.config';
import { INTERNAL_SERVER_ERROR } from '../constants/text.constant';

/**
 * @class HttpExceptionFilter
 * @classdesc catch globally exceptions & formatting error message to <HttpErrorResponse>
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly configService: ConfigService) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const request = host.switchToHttp().getRequest();
		const response = host.switchToHttp().getResponse();

		const exceptionStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const errorResponse =
			exception instanceof HttpException
				? (exception.getResponse() as ExceptionInfo)
				: { message: INTERNAL_SERVER_ERROR, error: exception };

		const errorMessage = lodash.isString(errorResponse)
			? errorResponse
			: errorResponse.message;
		const errorInfo = lodash.isString(errorResponse)
			? errorMessage
			: errorResponse.error;

		const data: HttpResponseError = {
			status: ResponseStatus.Error,
			message: errorMessage,
			error:
				errorInfo?.message ||
				(lodash.isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
			debug:
				this.configService.get<string>('app.nodeEnv') ===
				Environment.Development
					? errorInfo?.stack || exception.stack
					: UNDEFINED,
		};

		// default 404
		if (exceptionStatus === HttpStatus.NOT_FOUND) {
			data.error = data.error || `Not found`;
			data.message =
				data.message || `Invalid API: ${request.method} > ${request.url}`;
		}

		return response.status(errorInfo?.status || exceptionStatus).jsonp(data);
	}
}
