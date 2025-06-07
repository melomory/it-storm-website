import {
  Component,
  ElementRef,
  inject,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { RequestService } from '../../services/request.service';
import { Request } from '../../../models/request.type';
import { RequestType } from '../../../models/request-type.type';
import { DefaultResponse } from '../../../models/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive, NgStyle, ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<unknown> | null = null;
  private requestService = inject(RequestService);
  private fb: FormBuilder = inject(FormBuilder);
  private dialog: MatDialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  requestFreeConsultationForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  isRequestSent = false;
  isRequestSentError = false;

  /**
   * Запросить бесплатную консультацию.
   */
  requestFreeConsultation() {
    this.isRequestSent = false;
    this.isRequestSentError = false;
    this.dialogRef = this.dialog.open(this.popup);
  }

  /**
   * Закрыть попап.
   */
  closePopup() {
    this.dialogRef?.close();
  }

  /**
   * Отправить запрос на консультацию.
   */
  sendRequestOnSubmit() {
    if (this.requestFreeConsultationForm.valid) {
      this.requestService
        .sendRequest({
          name: this.requestFreeConsultationForm.value.name,
          phone: this.requestFreeConsultationForm.value.phone,
          type: RequestType.consultation,
        } as Request)
        .subscribe({
          next: (data: DefaultResponse) => {
            if (data.error && data.message) {
              this.snackBar.open(data.message);
              throw new Error(data.message);
            }

            this.isRequestSent = true;
          },
          error: () => {
            this.isRequestSentError = true;
          },
        });
    } else {
      this.requestFreeConsultationForm.markAllAsTouched();
    }
  }
}
