import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./views/user/signup/signup.component').then(
            (c) => c.SignupComponent
          ),
      },
    ],
  },
];
