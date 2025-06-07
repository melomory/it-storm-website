import {
  Component,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RequestService } from '../../shared/services/request.service';
import { Request } from '../../models/request.type';
import { RequestType } from '../../models/request-type.type';
import { DefaultResponse } from '../../models/default-response.type';
import { NgStyle } from '@angular/common';
import { ArticleService } from '../../shared/services/article.service';
import { Article } from '../../models/article.type';
import { ArticleCardComponent } from "../../shared/components/article-card/article-card.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [CarouselModule, ReactiveFormsModule, NgStyle, ArticleCardComponent, RouterLink],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 0,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 1,
      },
      940: {
        items: 1,
      },
    },
  };

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
    },
  };

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<unknown> | null = null;

  private dialog: MatDialog = inject(MatDialog);
  private fb: FormBuilder = inject(FormBuilder);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private requestService: RequestService = inject(RequestService);
  private articleService: ArticleService = inject(ArticleService);

  requestOrderForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    service: ['', [Validators.required]],
  });

  isRequestSent = false;
  isRequestSentError = false;
  popularArticles: Article[] = [];

  ngOnInit(): void {
    this.articleService.getPopularArticles().subscribe((data: Article[]) => {
      this.popularArticles = data;
    });
  }

  /**
   * Запросить услугу.
   */
  requestOrder(serviceName?: string | null): void {
    this.isRequestSent = false;
    this.isRequestSentError = false;
    this.requestOrderForm.patchValue({ service: serviceName });
    this.dialogRef = this.dialog.open(this.popup);
  }

  /**
   * Закрыть попап.
   */
  closePopup(): void {
    this.dialogRef?.close();
  }

  /**
   * Отправить запрос на услугу.
   */
  sendRequestOnSubmit(): void {
    if (this.requestOrderForm.valid) {
      this.requestService
        .sendRequest({
          name: this.requestOrderForm.value.name,
          phone: this.requestOrderForm.value.phone,
          service: this.requestOrderForm.value.service,
          type: RequestType.order,
        } as Request)
        .subscribe({
          next: (data: DefaultResponse) => {
            if (data.error && data.message) {
              this.isRequestSentError = true;
              throw new Error(data.message);
            }

            this.isRequestSent = true;
          },
          error: () => {
            this.isRequestSentError = true;
          },
        });
    } else {
      this.requestOrderForm.markAllAsTouched();
    }
  }
}
