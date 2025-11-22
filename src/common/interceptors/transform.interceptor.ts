import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { HttpResponseSuccess, ResponseStatus } from '@app/common/interfaces/response.interface';
import { getResponserOptions } from '@app/common/decorators/responser.decorator';
import * as TEXT from '@app/common/constants/text.constant';

/**
 * @class TransformInterceptor
 * @classdesc transform `T` to `HttpResponseSuccess<T>` when controller `Promise` resolved
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T | HttpResponseSuccess<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | HttpResponseSuccess<T>> {
    const call$ = next.handle();
    const target = context.getHandler();
    const { successMessage, transform, paginate } = getResponserOptions(target);
    if (!transform) {
      return call$;
    }
    return call$.pipe(
      map((data: any) => {
        return {
          status: ResponseStatus.Success,
          message: successMessage || TEXT.HTTP_DEFAULT_SUCCESS_TEXT,
          result: paginate
            ? {
                data: data.items,
                pagination: {
                  total: data.total,
                  page: data.page,
                  limit: data.limit,
                  totalPage: data.totalPage,
                },
              }
            : data,
        };
      }),
    );
  }
}
