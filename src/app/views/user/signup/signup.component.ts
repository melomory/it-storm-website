import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgStyle, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
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
}
