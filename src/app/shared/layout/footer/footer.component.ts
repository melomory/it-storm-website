import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(private dialog: MatDialog) {}

  /**
   * Requests a free consultation.
   */
  requestFreeConsultation() {
    this.dialogRef = this.dialog.open(this.popup);
  }

  /**
   * Closes popup.
   */
  closePopup() {
    this.dialogRef?.close();
  }
}
