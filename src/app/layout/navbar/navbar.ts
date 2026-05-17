import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppNotification } from '../../core/models/notification.model';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule, MatDividerModule],
  template: `
    <mat-toolbar>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button [matBadge]="(unreadCount | async) ?? 0" matBadgeSize="small"
              [matMenuTriggerFor]="notifMenu" (click)="loadNotifications()">
        <mat-icon>notifications_none</mat-icon>
      </button>

      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>person_outline</mat-icon>
      </button>

      <mat-menu #notifMenu="matMenu" class="notif-menu">
        <div class="notif-header">
          <span class="notif-title">Notificaciones</span>
          <button mat-button (click)="markAllRead()" class="mark-read-btn">Marcar leídas</button>
        </div>
        @for (n of notifications; track n.id) {
          <button mat-menu-item (click)="markRead(n)" class="notif-item">
            <span class="notif-item-title">{{ n.title }}</span>
            <span class="notif-date">{{ n.createdAt | date:'short' }}</span>
          </button>
        } @empty {
          <span mat-menu-item disabled class="notif-empty">Sin notificaciones</span>
        }
      </mat-menu>

      <mat-menu #userMenu="matMenu">
        <div class="user-card" mat-menu-item disabled>
          <div class="user-card-name">{{ auth.currentUser?.name }}</div>
          <div class="user-card-email">{{ auth.currentUser?.email }}</div>
        </div>
        <mat-divider />
        <button mat-menu-item routerLink="/settings">
          <mat-icon>settings</mat-icon>
          <span>Configuración</span>
        </button>
        <button mat-menu-item (click)="logout()" class="logout-item">
          <mat-icon>logout</mat-icon>
          <span>Cerrar sesión</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    mat-toolbar {
      position: relative;
      z-index: 10;
      background: var(--bg-card) !important;
      border-bottom: 1px solid var(--border) !important;
      box-shadow: none !important;
    }

    .toolbar-spacer { flex: 1 1 auto; }

    .notif-menu { min-width: 360px; max-width: 400px; }

    .notif-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
    }

    .notif-title {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .mark-read-btn {
      font-size: 12px !important;
      color: var(--text-muted) !important;
      min-height: auto !important;
      line-height: 1 !important;
      padding: 4px 8px !important;
    }
    .mark-read-btn:hover {
      color: var(--text-primary) !important;
    }

    .notif-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      height: auto !important;
      padding: 14px 20px !important;
      line-height: 1.3;
      border-bottom: 1px solid var(--border-light);
      transition: background-color 0.15s ease;
    }
    .notif-item:hover {
      background-color: var(--bg-hover) !important;
    }

    .notif-item-title {
      font-size: 13px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .notif-date {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .notif-empty {
      color: var(--text-muted) !important;
      font-size: 13px !important;
      text-align: center;
    }

    .user-card {
      pointer-events: none;
      padding: 14px 20px !important;
    }

    .user-card-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
    }

    .user-card-email {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 1px;
    }

    .logout-item .mat-icon {
      color: var(--error) !important;
    }
    .logout-item span {
      color: var(--error) !important;
    }

    /* Icon styling */
    mat-toolbar .mat-mdc-icon-button {
      color: var(--text-secondary) !important;
      transition: color 0.15s ease;
    }
    mat-toolbar .mat-mdc-icon-button:hover {
      color: var(--text-primary) !important;
      background: var(--bg-hover) !important;
    }
  `]
})
export class Navbar {
  showNotifications = false;
  notifications: AppNotification[] = [];
  unreadCount: Observable<number> = of(0);

  constructor(public auth: AuthService, private notifService: NotificationService) {
    this.unreadCount = this.notifService.getUnreadCount();
  }

  loadNotifications() {
    this.notifService.getAll().subscribe((n: AppNotification[]) => this.notifications = n);
  }

  markRead(n: AppNotification) {
    if (!n.isRead) {
      this.notifService.markAsRead(n.id).subscribe(() => {
        n.isRead = true;
        this.unreadCount = this.notifService.getUnreadCount();
      });
    }
  }

  markAllRead() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = this.notifService.getUnreadCount();
    });
  }

  logout() { this.auth.logout(); }
}
