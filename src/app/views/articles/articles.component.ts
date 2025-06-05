import { Component, inject, OnInit } from '@angular/core';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { ArticleService } from '../../shared/services/article.service';
import { Articles } from '../../models/article.type';
import { debounceTime } from 'rxjs';
import { ActiveParamsType } from '../../models/active-params.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivePramUtil } from '../../shared/utils/active-params.util';
import { CategoryFilterComponent } from '../../shared/components/category-filter/category-filter.component';
import { Category } from '../../models/category.type';
import { CategoryService } from '../../shared/services/category.service';

@Component({
  selector: 'app-articles',
  imports: [ArticleCardComponent, CategoryFilterComponent],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent implements OnInit {
  private articleService: ArticleService = inject(ArticleService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private categoryService: CategoryService = inject(CategoryService);

  articles!: Articles;
  activeParams: ActiveParamsType = { categories: [] };
  pages: number[] = [];

  get categories(): Category[] {
    return this.categoryService.categories.filter(
      (item) =>
        this.activeParams.categories?.some(
          (category) => category === item.url
        ) ?? false
    );
  }

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

  removeAppliedFilter(category: Category) {
    this.activeParams.categories = this.activeParams.categories?.filter(
      (item) => item !== category.url
    );

    this.activeParams.page = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams,
    });
  }
}
