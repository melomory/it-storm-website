import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DefaultResponse } from '../../models/default-response.type';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Comment } from '../../models/comment.type';
import { CommentAction } from '../../models/comment-action.type';
import { CommentActionResponse } from '../../models/comment-action-response.type';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http: HttpClient = inject(HttpClient);

  /**
   * Добавить комментарий.
   * @param text Текст комментария.
   * @param articleId Ид статьи.
   * @returns Результат запроса.
   */
  addComment(text: string, articleId: string): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(environment.api + 'comments', {
      text,
      article: articleId,
    });
  }

  /**
   * Получить комментарии.
   * @param offset Смещение по количеству комментариев, которые необходимо запросить.
   * @param articleId Ид статьи.
   * @returns Результат запроса.
   */
  getComments(
    offset: number,
    articleId: string
  ): Observable<{
    allCount: number;
    comments: Comment[];
  }> {
    return this.http.get<{
      allCount: number;
      comments: Comment[];
    }>(environment.api + 'comments', {
      params: {
        offset,
        article: articleId,
      },
    });
  }

  /**
   * Применить действие для статьи.
   * @param action Действие.
   * @param commentId Ид комментария.
   * @returns Результат запроса.
   */
  applyAction(
    action: CommentAction,
    commentId: string
  ): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      environment.api + `comments/${commentId}/apply-action`,
      {
        action,
      }
    );
  }

  /**
   * Получить действия для комментария.
   */
  getActions(
    commentId: string
  ): Observable<DefaultResponse | CommentActionResponse[]> {
    return this.http.get<DefaultResponse | CommentActionResponse[]>(
      environment.api + `comments/${commentId}/actions`
    );
  }
}
