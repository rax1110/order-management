import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();
    
    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;

          this.logger.log({
            method,
            url,
            ip,
            userAgent,
            responseTime,
            status: context.switchToHttp().getResponse().statusCode,
          });
        },
        error: (err) => {
          const responseTime = Date.now() - startTime;

          this.logger.error({
            method,
            url,
            ip,
            userAgent,
            responseTime,
            error: err.message,
          });
        }
      }),
    );
  }
} 