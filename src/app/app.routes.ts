import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { Role } from './core/models/user.model';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./features/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'products', loadComponent: () => import('./features/products/products').then(m => m.Products) },
      { path: 'inventory', loadComponent: () => import('./features/inventory/inventory').then(m => m.Inventory) },
      { path: 'categories', loadComponent: () => import('./features/categories/categories').then(m => m.Categories) },
      { path: 'suppliers', loadComponent: () => import('./features/suppliers/suppliers').then(m => m.Suppliers) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports').then(m => m.Reports) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings').then(m => m.Settings) },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users').then(m => m.Users),
        canActivate: [RoleGuard],
        data: { roles: [Role.ADMIN] },
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
