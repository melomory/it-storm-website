import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Request } from '../../models/request.type';
import { DefaultResponse } from '../../models/default-response.type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private http: HttpClient = inject(HttpClient);

  /**
   * Отправить запрос.
   * @param request Запрос.
   * @returns Результат запроса.
   */
  sendRequest(request: Request): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      environment.api + 'requests',
      request
    );
  }
}
