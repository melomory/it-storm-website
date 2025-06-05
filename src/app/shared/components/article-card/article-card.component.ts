import { Component, Input } from '@angular/core';
import { Article } from '../../../models/article.type';
import { environment } from '../../../../environments/environment.development';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-card',
  imports: [RouterModule],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.scss',
})
export class ArticleCardComponent {
  @Input() article!: Article;
  serverStaticPath = environment.serverStaticPath;
}
