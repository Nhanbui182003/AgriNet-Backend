/**
 * @file HTTP interface
 * @module interface/http
 */

export type ResponseMessage = string;

export type ResponseMessageObject = {
  message: ResponseMessage;
  error?: any;
  details?: any;
};

export enum ResponseStatus {
  Error = 'error',
  Success = 'success',
}

export interface HttpResponseBase {
  status: ResponseStatus;
  message: ResponseMessage;
}

export type ExceptionInfo = ResponseMessage | ResponseMessageObject;

// paginate data
export interface HttpPaginateResult<T> {
  data: T;
  pagination: {
    total: number;
    currentPage: number;
    totalPage: number;
    perPage: number;
  };
}

// HTTP error
export type HttpResponseError = HttpResponseBase & {
  error: any;
  debug?: string;
  details?: any;
};

// HTTP success
export type HttpResponseSuccess<T> = HttpResponseBase & {
  params?: any;
  result: T | HttpPaginateResult<T>;
};

// HTTP response
export type HttpResponse<T> = HttpResponseError | HttpResponseSuccess<T>;
