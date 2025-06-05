import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActiveParamsType } from '../../../models/active-params.type';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ActivePramUtil } from '../../utils/active-params.util';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../models/category.type';

@Component({
  selector: 'app-category-filter',
  imports: [],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent implements OnInit {
  open = false;
  activeParams: ActiveParamsType = { categories: [] };
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private categoryService: CategoryService = inject(CategoryService);
  categories: Category[] = [];

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.open && !(event.target as HTMLElement).closest('.filter')) {
      this.open = false;
    }
  }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(debounceTime(500))
      .subscribe((params) => {
        this.activeParams = ActivePramUtil.processParams(params);

        this.categoryService.getCategories().subscribe((data) => {
          this.categories = data;
          this.categoryService.categories = data;

          this.activeParams.categories = this.activeParams.categories?.filter(
            (category) => this.categories.some((item) => item.url === category)
          );
        });
      });
  }

  toggle() {
    this.open = !this.open;
  }

  isCategorySetToFilter(categoryUrl: string): boolean {
    return (
      this.activeParams.categories?.some(
        (category) => category === categoryUrl
      ) ?? false
    );
  }

  setCategoryToFilter(categoryUrl: string) {
    if (
      !this.activeParams.categories?.some(
        (category) => category === categoryUrl
      )
    ) {
      this.activeParams.categories?.push(categoryUrl);
    } else {
      this.activeParams.categories = this.activeParams.categories?.filter(
        (category) => category !== categoryUrl
      );
    }

    this.router.navigate(['/articles'], {
      queryParams: this.activeParams,
    });
  }
}
