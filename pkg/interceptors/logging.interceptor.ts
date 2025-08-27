import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConsoleLogger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new ConsoleLogger({
    json: true,
    colors: true,
  });

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body, params, query } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip || '';

    const requestInfo = {
      method,
      url,
      params,
      query,
      body: method !== 'GET' ? body : undefined,
      userAgent,
      ip,
    };

    this.logger.log('Incoming request', JSON.stringify(requestInfo));

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const responseTime = Date.now() - now;
          const responseInfo = {
            method,
            url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            responseSize: JSON.stringify(responseBody).length,
          };

          this.logger.log('Request completed', JSON.stringify(responseInfo));
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          const errorInfo = {
            method,
            url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            error: error.message,
          };

          this.logger.error('Request failed', JSON.stringify(errorInfo));
        },
      }),
    );
  }
}
