import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../../models/category.type';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http: HttpClient = inject(HttpClient);
  categories: Category[] = [];

  /**
   * Получить категории.
   * @returns Категории.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.api + 'categories');
  }
}
