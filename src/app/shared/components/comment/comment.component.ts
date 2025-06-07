import { Component, inject, Input, OnInit } from '@angular/core';
import { Comment } from '../../../models/comment.type';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../services/comment.service';
import { CommentAction } from '../../../models/comment-action.type';
import { DefaultResponse } from '../../../models/default-response.type';
import { CommentActionResponse } from '../../../models/comment-action-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comment',
  imports: [DatePipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnInit {
  private commentService: CommentService = inject(CommentService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  commentAction = CommentAction;
  appliedAction = CommentAction.default;

  @Input() comment!: Comment;

  ngOnInit(): void {
    this.getActions();
  }

  /**
   * Применить действие.
   * @param action Действие.
   */
  applyAction(action: CommentAction) {
    this.commentService.applyAction(action, this.comment.id).subscribe({
      next: (data: DefaultResponse) => {
        if (data.error && data.message) {
          this.snackBar.open(data.message);
          throw new Error(data.message);
        }

        const currentAppliedAction = this.appliedAction;

        this.getActions();
        if (action === CommentAction.dislike) {
          if (currentAppliedAction === CommentAction.like) {
            this.comment.likesCount = Math.max(this.comment.likesCount - 1, 0);
            this.comment.dislikesCount += 1;
          } else if (currentAppliedAction === CommentAction.dislike) {
            this.comment.dislikesCount = Math.max(
              this.comment.dislikesCount - 1,
              0
            );
            this.appliedAction = CommentAction.default;
          } else {
            this.comment.dislikesCount += 1;
          }
        } else if (action === CommentAction.like) {
          if (currentAppliedAction === CommentAction.dislike) {
            this.comment.dislikesCount = Math.max(
              this.comment.dislikesCount - 1,
              0
            );
            this.comment.likesCount += 1;
          } else if (currentAppliedAction === CommentAction.like) {
            this.comment.likesCount = Math.max(this.comment.likesCount - 1, 0);
            this.appliedAction = CommentAction.default;
          } else {
            this.comment.likesCount += 1;
          }
        }

        if (action === CommentAction.violate) {
          this.snackBar.open('Жалоба отправлена');
        } else {
          this.snackBar.open('Ваш голос учтен');
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          if (action === CommentAction.violate) {
            this.snackBar.open('Жалоба уже отправлена');
          } else {
            this.snackBar.open(errorResponse.error.message);
          }
        } else {
          this.snackBar.open('Ошибка отправки реакций для комментариев');
        }
      },
    });
  }

  /**
   * Получить действия.
   */
  getActions() {
    this.commentService.getActions(this.comment.id).subscribe({
      next: (data: CommentActionResponse[] | DefaultResponse) => {
        let error = null;
        if ((data as DefaultResponse).error !== undefined) {
          error = (data as DefaultResponse).message;
        }

        const commentActionResponse = data as CommentActionResponse[];

        if (error) {
          this.snackBar.open(error);
          throw new Error(error);
        }

        if (
          Array.isArray(commentActionResponse) &&
          commentActionResponse.length > 0
        ) {
          this.appliedAction = commentActionResponse[0].action;
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this.snackBar.open(errorResponse.error.message);
        } else {
          this.snackBar.open('Ошибка получения реакций для комментариев');
        }
      },
    });
  }
}
