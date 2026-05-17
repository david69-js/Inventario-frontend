import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule],
  template: `
    <mat-nav-list class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <svg width="18" height="18" viewBox="0 0 76 65" fill="currentColor">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
          </svg>
        </div>
        <div>
          <div class="sidebar-title">Inventario</div>
          <div class="sidebar-subtitle">Panel de control</div>
        </div>
      </div>
      <div class="sidebar-divider"></div>
      @for (item of menuItems; track item.path) {
        @if (item.roles.length === 0 || auth.hasRole(item.roles)) {
          <mat-list-item [routerLink]="item.path" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: item.path === '/dashboard'}">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </mat-list-item>
        }
      }
      <div class="sidebar-divider"></div>
      <mat-list-item routerLink="/settings" routerLinkActive="active-link">
        <mat-icon matListItemIcon>settings</mat-icon>
        <span matListItemTitle>Configuración</span>
      </mat-list-item>
      <div class="sidebar-spacer"></div>
      <div class="sidebar-divider"></div>
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
    .sidebar {
      width: 256px;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--bg-card);
      border-right: 1px solid var(--border);
      padding-top: 0;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      min-height: 56px;
    }

    .sidebar-logo {
      width: 32px;
      height: 32px;
      background: var(--accent);
      color: #ffffff;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      transition: transform 0.2s ease;
    }
    .sidebar-logo:hover {
      transform: scale(1.05);
    }

    .sidebar-title {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.2;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .sidebar-subtitle {
      font-size: 11px;
      color: var(--text-muted);
    }

    .sidebar-divider {
      height: 1px;
      background: var(--border);
      margin: 4px 16px;
    }

    .sidebar-spacer { flex: 1; }

    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
    }

    .sidebar-avatar {
      width: 32px;
      height: 32px;
      background: var(--bg-hover);
      color: var(--text-secondary);
      border: 1px solid var(--border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      transition: border-color 0.15s ease;
    }
    .sidebar-avatar:hover {
      border-color: var(--text-muted);
    }

    .sidebar-user-info { line-height: 1.2; }

    .sidebar-user-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .sidebar-user-role {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: capitalize;
    }

    /* Nav items */
    mat-list-item {
      --mdc-list-list-item-hover-state-layer-opacity: 0;
      border-radius: 6px !important;
      margin: 1px 8px !important;
      transition: background-color 0.15s ease;
      cursor: pointer;
    }
    mat-list-item:hover {
      background-color: var(--bg-hover) !important;
    }
    mat-list-item .mat-icon {
      color: var(--text-muted) !important;
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
      transition: color 0.15s ease;
    }
    mat-list-item:hover .mat-icon {
      color: var(--text-primary) !important;
    }
    mat-list-item span[matListItemTitle] {
      font-size: 13px !important;
      font-weight: 500 !important;
      color: var(--text-secondary) !important;
      transition: color 0.15s ease;
    }
    mat-list-item:hover span[matListItemTitle] {
      color: var(--text-primary) !important;
    }

    /* Active link */
    .active-link {
      background: var(--accent-light) !important;
      position: relative;
    }
    .active-link::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      background: var(--accent);
      border-radius: 0 2px 2px 0;
    }
    .active-link .mat-icon {
      color: var(--accent) !important;
    }
    .active-link span[matListItemTitle] {
      color: var(--accent) !important;
      font-weight: 600 !important;
    }
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

  constructor(public auth: AuthService) {}
}
