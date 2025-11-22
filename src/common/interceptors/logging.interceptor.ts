/**
 * @file Dev logging interceptor
 * @module interceptor/logging
 */

import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const call$ = next.handle();
    const request = context.switchToHttp().getRequest<Request>();
    const content = request.method + ' -> ' + request.url;
    const now = Date.now();
    // TODO: add cloudwatch logs
    return call$.pipe(tap(() => console.debug('--- res:', content, `${Date.now() - now}ms`)));
  }
}
