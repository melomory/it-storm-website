import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

import { Router } from '@angular/router';
import { DefaultResponse } from '../../models/default-response.type';
import { LoginResponse } from '../../models/login-response.type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  // private loaderService: LoaderService

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // this.loaderService.show();

    console.log('Intercepting Requests');
    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      });

      return next.handle(authReq).pipe(
        catchError((error) => {
          if (
            error.status === 401 &&
            !authReq.url.includes('/login') &&
            !authReq.url.includes('/refresh')
          ) {
            return this.handle401Error(authReq, next);
          }

          return throwError(() => error);
        }),
        finalize(() => {
          // this.loaderService.hide();
        })
      );
    }

    return next.handle(req).pipe(
      finalize(() => {
        // this.loaderService.hide();
      })
    );
  }

  handle401Error(req: HttpRequest<unknown>, next: HttpHandler) {
    return this.authService.refresh().pipe(
      switchMap((result: DefaultResponse | LoginResponse) => {
        let error = '';
        if ((result as DefaultResponse).error !== undefined) {
          error = (result as DefaultResponse).message;
        }

        const refreshResult = result as LoginResponse;
        if (
          !refreshResult.accessToken ||
          !refreshResult.refreshToken ||
          !refreshResult.userId
        ) {
          error = 'Ошибка авторизации';
        }

        if (error) {
          return throwError(() => new Error(error));
        }

        this.authService.setTokens(
          refreshResult.accessToken,
          refreshResult.refreshToken
        );

        const authReq = req.clone({
          headers: req.headers.set('x-auth', refreshResult.accessToken),
        });

        return next.handle(authReq);
      }),
      catchError((error) => {
        this.authService.removeTokens();
        this.router.navigate(['/']);
        return throwError(() => error);
      })
    );
  }
}
