import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DefaultResponse } from '../../../models/default-response.type';
import { LoginResponse } from '../../../models/login-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgStyle, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private authService: AuthService = inject(AuthService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);
  private fb = inject(FormBuilder);
  signupForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё-]+\s*)+$/)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/),
      ],
    ],
    isAgree: [false, [Validators.requiredTrue]],
  });

  signup() {
    if (
      this.signupForm.valid &&
      this.signupForm.value.email &&
      this.signupForm.value.password &&
      this.signupForm.value.name &&
      this.signupForm.value.isAgree
    )
      this.authService
        .signup(
          this.signupForm.value.email,
          this.signupForm.value.password,
          this.signupForm.value.name
        )
        .subscribe({
          next: (data: DefaultResponse | LoginResponse) => {
            let error = null;
            if ((data as DefaultResponse).error !== undefined) {
              error = (data as DefaultResponse).message;
            }

            const loginResponse = data as LoginResponse;

            if (
              !loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId
            ) {
              error = 'Ошибка авторизации';
            }

            if (error) {
              this.snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(
              loginResponse.accessToken,
              loginResponse.refreshToken
            );
            this.authService.userId = loginResponse.userId;
            this.snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.open(errorResponse.error.message);
            } else {
              this.snackBar.open('Ошибка регистрации');
            }
          },
        });
  }
}
