import { inject, Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DefaultResponse } from '../../models/default-response.type';
import { LoginResponse } from '../../models/login-response.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);

  public accessTokenKey = 'accessToken';
  public refreshTokenKey = 'refreshToken';
  public userIdKey = 'userId';

  public isLoggedIn$: Subject<boolean> = new Subject<boolean>();
  private isLoggedIn = false;

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(userId: string | null) {
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  constructor() {
    this.isLoggedIn = !!localStorage.getItem(this.accessTokenKey);
  }

  /**
   * Получить признак, что пользователь вошел в аккаунт.
   * @returns true, если пользователь вошел в аккаунт.
   */
  public getIsLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  /**
   * Выполнить вход в аккаунт.
   * @param email Электронная почта.
   * @param password Пароль.
   * @param rememberMe Признак, что нужно запомнить пользователя.
   * @returns Ответ с сервера.
   */
  public login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Observable<DefaultResponse | LoginResponse> {
    return this.http.post<DefaultResponse | LoginResponse>(
      environment.api + 'login',
      {
        email,
        password,
        rememberMe,
      }
    );
  }

  /**
   * Выполнить выход из аккаунта.
   * @returns Ответ с сервера.
   */
  logout(): Observable<DefaultResponse> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponse>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken,
      });
    }

    throw throwError(() => 'Cannot find token');
  }

  /**
   * Обновить токены.
   */
  public refresh(): Observable<DefaultResponse | LoginResponse> {
    const tokens = this.getTokens();

    if (tokens && tokens.refreshToken) {
      this.http.post<DefaultResponse | LoginResponse>(
        environment.api + 'refresh',
        {
          refreshToken: tokens.refreshToken,
        }
      );
    }

    throw throwError(() => 'Cannot use token');
  }

  /**
   * Установить токены в локальное хранилище.
   * @param accessToken Токен доступа.
   * @param refreshToken Токен обновления.
   */
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLoggedIn = true;
    this.isLoggedIn$.next(true);
  }

  /**
   * Удалить токены из локального хранилища.
   */
  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedIn = false;
    this.isLoggedIn$.next(false);
  }

  /**
   * Получить токены из локального хранилища.
   * @returns Токены.
   */
  public getTokens(): {
    accessToken: string | null;
    refreshToken: string | null;
  } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }
}
