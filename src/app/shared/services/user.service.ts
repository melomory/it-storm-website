import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../../models/user-response.type';
import { DefaultResponse } from '../../models/default-response.type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http: HttpClient = inject(HttpClient);

  user: UserResponse | null = null;

  /**
   * Получить информацию о пользователе.
   * @returns Информация о пользователе.
   */
  getUserInfo(): Observable<UserResponse | DefaultResponse> {
    return this.http.get<UserResponse | DefaultResponse>(
      environment.api + 'users'
    );
  }
}
