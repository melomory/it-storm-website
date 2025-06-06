import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { DefaultResponse } from '../../../models/default-response.type';
import { UserResponse } from '../../../models/user-response.type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authService: AuthService = inject(AuthService);
  private userService: UserService = inject(UserService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  isLoggedIn = false;
  user: UserResponse | null = null;

  constructor() {
    this.isLoggedIn = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn: boolean) => {
      this.isLoggedIn = isLoggedIn;
    });

    if (this.isLoggedIn) {
      this.userService.getUserInfo().subscribe({
        next: (data: UserResponse | DefaultResponse) => {
          let error = null;
          if ((data as DefaultResponse).error !== undefined) {
            error = (data as DefaultResponse).message;
          }

          const userResponse = data as UserResponse;

          if (!userResponse.id || !userResponse.name || !userResponse.email) {
            error = 'Ошибка получения информации о пользователе';
          }

          if (error) {
            this.snackBar.open(error);
            throw new Error(error);
          }

          this.userService.user = userResponse;
          this.user = userResponse;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this.snackBar.open(errorResponse.error.message);
          } else {
            this.snackBar.open('Ошибка получения информации о пользователе');
          }
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.authService.isLoggedIn$?.unsubscribe();
  }

  /**
   * Выполнить выход из аккаунта.
   */
  logout() {
    this.authService.logout().subscribe({
      next: () => this.doLogout(),
      error: () => this.doLogout(),
    });
  }

  /**
   * Выполнить действия при выходе из аккаунта.
   */
  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }
}
