import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, Articles } from '../../models/article.type';
import { environment } from '../../../environments/environment.development';
import { ActiveParamsType } from '../../models/active-params.type';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private http: HttpClient = inject(HttpClient);

  /**
   * Получить статьи.
   * @param params Параметры запроса.
   * @returns Статьи.
   */
  getArticles(params: ActiveParamsType): Observable<Articles> {
    return this.http.get<Articles>(environment.api + 'articles', {
      params: params,
    });
  }

  /**
   * Получить связанные статьи.
   * @param url URL основной статьи.
   * @returns Связанные статьи.
   */
  getRelatedArticles(url: string): Observable<Article[]> {
    return this.http.get<Article[]>(
      environment.api + `articles/related/${url}`
    );
  }

  /**
   * Получить статьи.
   * @param params Параметры запроса.
   * @returns Статьи.
   */
  getArticle(url: string): Observable<Article> {
    return this.http.get<Article>(environment.api + `articles/${url}`);
  }
}
