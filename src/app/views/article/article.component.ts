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

@Component({
  selector: 'app-article',
  imports: [ArticleCardComponent, RouterModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit, AfterViewChecked {
  private articleService: ArticleService = inject(ArticleService);
  private router: Router = inject(Router);
  private readonly viewContainerRef: ViewContainerRef =
    inject(ViewContainerRef);

  relatedArticles: Article[] = [];
  articleUrl: string = this.router.url.split('/').pop() ?? '';
  article: Article | null = null;
  serverStaticPath = environment.serverStaticPath;

  ngOnInit(): void {
    this.articleService
      .getRelatedArticles(this.articleUrl)
      .subscribe((data) => {
        this.relatedArticles = data;
      });

    this.articleService.getArticle(this.articleUrl).subscribe((data) => {
      this.article = data;
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
}
