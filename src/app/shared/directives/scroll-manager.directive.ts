import { Directive, Injectable } from '@angular/core';
import { ScrollSectionDirective } from './scroll-section.directive';
// import { firstValueFrom, lastValueFrom, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Directive({
  selector: '[appScrollManager]',
})
export class ScrollManagerDirective {
  private sections = new Map<string | number, ScrollSectionDirective>();

  /**
   * Выполнить перемещение к элементу.
   * @param id Ид элемента.
   */
  scroll(id: string | number) {
    setTimeout(() => {
      this.sections.get(id)!.scroll();
    }, 250);
  }

  /**
   * Зарегистрировать элемент.
   * @param section Элемент.
   */
  register(section: ScrollSectionDirective) {
    this.sections.set(section.id, section);
  }

  /**
   * Удалить элемент.
   * @param section Элемент
   */
  remove(section: ScrollSectionDirective) {
    this.sections.delete(section.id);
  }
}
