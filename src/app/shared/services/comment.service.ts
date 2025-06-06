import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DefaultResponse } from '../../models/default-response.type';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Comment } from '../../models/comment.type';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http: HttpClient = inject(HttpClient);

  addComment(text: string, articleId: string): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(environment.api + 'comments', {
      text,
      article: articleId,
    });
  }

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
}
