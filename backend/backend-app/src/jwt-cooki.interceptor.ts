import {Injectable, NestInterceptor, ExecutionContext, CallHandler,} from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const res = context.switchToHttp().getResponse();
    const isProd = process.env.NODE_ENV === 'production';

    return next.handle().pipe(
      tap((data) => {
        if (data?.accessToken) {
          res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 1000 * 60 * 15,
          });

          delete data.accessToken;
        }

        if (data?.refreshToken) {
          res.cookie('refresh_token', data.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });

          delete data.refreshToken;
        }

        if (data?.csrfToken) {
          res.cookie('csrf_token', data.csrfToken, {
            httpOnly: false,  // blijft leesbaar in frontend
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
          });
        }
      }),
    );
  }
}