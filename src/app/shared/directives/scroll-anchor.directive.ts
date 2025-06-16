import { Directive, HostListener, inject, Input } from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

@Directive({
  selector: '[appScrollAnchor]',
})
export class ScrollAnchorDirective {
  @Input('appScrollAnchor') id: string | number = '';

  private manager: ScrollManagerDirective = inject(ScrollManagerDirective);

  @HostListener('click')
  scroll() {
    this.manager.scroll(this.id);
  }
}
