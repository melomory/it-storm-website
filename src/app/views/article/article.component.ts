import {
  AfterViewChecked,
  Component,
  inject,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../models/article.type';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../core/auth/auth.service';
import { CommentService } from '../../shared/services/comment.service';
import { DefaultResponse } from '../../models/default-response.type';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgStyle } from '@angular/common';
import { Comment } from '../../models/comment.type';

@Component({
  selector: 'app-article',
  imports: [
    ArticleCardComponent,
    RouterModule,
    ReactiveFormsModule,
    NgStyle,
    DatePipe,
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit, AfterViewChecked {
  private articleService: ArticleService = inject(ArticleService);
  private commentService: CommentService = inject(CommentService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private readonly viewContainerRef: ViewContainerRef =
    inject(ViewContainerRef);
  private fb = inject(FormBuilder);

  commentForm = this.fb.group({
    comment: ['', [Validators.required]],
  });

  relatedArticles: Article[] = [];
  articleUrl: string = this.router.url.split('/').pop() ?? '';
  article: Article | null = null;
  serverStaticPath = environment.serverStaticPath;
  commentsCount = 0;
  comments: Comment[] = [];

  get isLoggedIn() {
    return this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.articleService
      .getRelatedArticles(this.articleUrl)
      .subscribe((data) => {
        this.relatedArticles = data;
      });

    this.articleService.getArticle(this.articleUrl).subscribe((data) => {
      this.article = data;
      this.commentsCount = Math.min(this.article?.commentsCount ?? 0, 3);
      this.comments = data?.comments ?? [];
    });
  }

  ngAfterViewChecked() {
    this.fixEmulatedEncapsulation();
  }

  private fixEmulatedEncapsulation(): void {
    if (!this.viewContainerRef.element?.nativeElement) {
      return;
    }

    const elementRef: HTMLElement = this.viewContainerRef.element.nativeElement;
    const ngHostAttribute = elementRef
      .getAttributeNames()
      .find((attr) => attr.startsWith('_nghost-'));

    if (!ngHostAttribute) {
      return;
    }

    const ngContentAttribute = ngHostAttribute.replace(
      '_nghost-',
      '_ngcontent-'
    );

    console.log(elementRef);
    console.log(elementRef.querySelectorAll(`:not([${ngContentAttribute}])`));
    console.log(elementRef.querySelectorAll(`h3`));

    elementRef
      .querySelectorAll(`:not([${ngContentAttribute}])`)
      .forEach((elem) => elem.setAttribute(ngContentAttribute, ''));
  }

  /**
   * Добавить комментарий.
   */
  addComment() {
    if (this.commentForm.value.comment && this.article?.id) {
      this.commentService
        .addComment(this.commentForm.value.comment, this.article?.id)
        .subscribe((data: DefaultResponse) => {
          if (!data.error) {
            this.commentForm.reset();
          }
        });
    }
  }

  /**
   * Загрузить комментарии.
   */
  loadComments() {
    if (this.article?.id) {
      this.commentService
        .getComments(this.commentsCount, this.article.id)
        .subscribe((data: { allCount: number; comments: Comment[] }) => {
          this.comments.push(...data.comments);
          this.commentsCount += data.comments.length;
        });
    }
  }
}
