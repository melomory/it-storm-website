import { Component, inject, OnInit } from '@angular/core';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { ArticleService } from '../../shared/services/article.service';
import { Articles } from '../../models/article.type';
import { debounceTime } from 'rxjs';
import { ActiveParamsType } from '../../models/active-params.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivePramUtil } from '../../shared/utils/active-params.util';

@Component({
  selector: 'app-articles',
  imports: [ArticleCardComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent implements OnInit {
  private articleService: ArticleService = inject(ArticleService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  articles!: Articles;
  activeParams: ActiveParamsType = { categories: [] };
  pages: number[] = [];

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(debounceTime(500))
      .subscribe((params) => {
        this.activeParams = ActivePramUtil.processParams(params);

        if (!this.activeParams.page || this.activeParams.page < 1) {
          this.activeParams.page = 1;
          this.router.navigate(['/articles'], {
            queryParams: this.activeParams,
          });
          return;
        }

        this.articleService.getArticles(this.activeParams).subscribe((data) => {
          this.articles = data;

          this.pages = Array.from(
            { length: this.articles.pages },
            (_, index) => index + 1
          );

          if (
            this.activeParams.page &&
            this.activeParams.page > this.articles?.pages
          ) {
            this.activeParams.page = this.articles?.pages;
            this.router.navigate(['/articles'], {
              queryParams: this.activeParams,
            });
            return;
          }
        });
      });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams,
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams,
      });
    }
  }

  openNextPage() {
    if (
      this.activeParams.page &&
      this.activeParams.page < this.articles?.pages
    ) {
      this.activeParams.page++;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams,
      });
    }
  }
}
