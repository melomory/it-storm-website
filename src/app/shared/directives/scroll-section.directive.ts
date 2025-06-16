import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ScrollManagerDirective } from './scroll-manager.directive';

@Directive({
  selector: '[appScrollSection]',
})
export class ScrollSectionDirective implements OnInit, OnDestroy {
  @Input('appScrollSection') id: string | number = '';

  private host: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private manager: ScrollManagerDirective = inject(ScrollManagerDirective);

  constructor() {
    console.log('From constructor');
  }

  ngOnInit() {
    this.manager.register(this);
  }

  ngOnDestroy() {
    this.manager.remove(this);
  }

  /**
   * Выполнить перемещение.
   */
  scroll() {
    this.host.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
