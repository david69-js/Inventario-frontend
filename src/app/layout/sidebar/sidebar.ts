import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, MatIconModule, MatDividerModule],
  template: `
    <mat-nav-list class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">I</div>
        <div>
          <div class="sidebar-title">Inventario</div>
          <div class="sidebar-subtitle">Panel de control</div>
        </div>
      </div>
      <mat-divider />
      @for (item of menuItems; track item.path) {
        @if (item.roles.length === 0 || auth.hasRole(item.roles)) {
          <mat-list-item (click)="navigate(item.path)" [class.active-link]="isActive(item.path)">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </mat-list-item>
        }
      }
      <mat-divider />
      <mat-list-item (click)="navigate('/settings')" [class.active-link]="isActive('/settings')">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span matListItemTitle>Configuración</span>
      </mat-list-item>
      <div class="sidebar-spacer"></div>
      <mat-divider />
      <div class="sidebar-user">
        <div class="sidebar-avatar">{{ (auth.currentUser?.name ?? 'U')[0] }}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">{{ auth.currentUser?.name }}</div>
          <div class="sidebar-user-role">{{ auth.currentUser?.role?.toLowerCase() }}</div>
        </div>
      </div>
    </mat-nav-list>
  `,
  styles: [`
    .sidebar { width: 256px; height: 100%; display: flex; flex-direction: column; background: var(--mat-sys-surface-container); padding-top: 0; }
    .sidebar-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; min-height: 56px; }
    .sidebar-logo { width: 32px; height: 32px; background: var(--mat-sys-primary); color: var(--mat-sys-on-primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
    .sidebar-title { font-size: 14px; font-weight: 500; line-height: 1.2; }
    .sidebar-subtitle { font-size: 11px; color: var(--mat-sys-on-surface-variant); }
    .sidebar-spacer { flex: 1; }
    .sidebar-user { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
    .sidebar-avatar { width: 32px; height: 32px; background: var(--mat-sys-primary-container); color: var(--mat-sys-on-primary-container); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; }
    .sidebar-user-info { line-height: 1.2; }
    .sidebar-user-name { font-size: 13px; font-weight: 500; }
    .sidebar-user-role { font-size: 11px; color: var(--mat-sys-on-surface-variant); text-transform: capitalize; }
    .active-link { background: var(--mat-sys-secondary-container); }
    .active-link .mat-icon { color: var(--mat-sys-on-secondary-container); }
  `]
})
export class Sidebar {
  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', roles: [] },
    { path: '/products', label: 'Productos', icon: 'inventory_2', roles: [] },
    { path: '/inventory', label: 'Inventario', icon: 'warehouse', roles: [] },
    { path: '/categories', label: 'Categorías', icon: 'category', roles: [] },
    { path: '/suppliers', label: 'Proveedores', icon: 'local_shipping', roles: [] },
    { path: '/reports', label: 'Reportes', icon: 'bar_chart', roles: [] },
    { path: '/users', label: 'Usuarios', icon: 'people', roles: [Role.ADMIN] },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  navigate(path: string) { this.router.navigate([path]); }

  isActive(path: string): boolean {
    return this.router.isActive(path, { paths: 'exact', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' });
  }
}
