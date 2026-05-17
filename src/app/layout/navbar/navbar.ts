import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppNotification } from '../../core/models/notification.model';
import { AsyncPipe, DatePipe, SlicePipe } from '@angular/common';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, DatePipe, SlicePipe],
  template: `
    <header class="h-16 bg-card border-b border-border flex items-center justify-between px-8 shrink-0">
      <div class="flex items-center gap-3">
        <span class="text-sm text-muted-foreground">/</span>
        <h2 class="text-sm font-medium text-foreground">{{ pageTitle }}</h2>
      </div>

      <div class="flex items-center gap-1">
        <button class="relative p-2 rounded-lg hover:bg-accent transition-colors"
                (click)="toggleNotifications()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-muted-foreground"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          @if ((unreadCount | async) ?? 0 > 0) {
            <span class="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {{ unreadCount | async }}
            </span>
          }
        </button>

        <div class="relative">
          <button (click)="showUserMenu = !showUserMenu"
                  class="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
            <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-medium text-accent-foreground">
              {{ (auth.currentUser?.name ?? 'U') | slice:0:1 }}
            </div>
            <div class="text-left hidden sm:block">
              <p class="text-sm font-medium text-foreground leading-tight">{{ auth.currentUser?.name }}</p>
              <p class="text-xs text-muted-foreground capitalize">{{ auth.currentUser?.role?.toLowerCase() }}</p>
            </div>
          </button>

          @if (showUserMenu) {
            <div class="absolute right-0 top-full mt-2 w-56 bg-popover rounded-xl border border-border shadow-lg overflow-hidden z-50">
              <div class="px-4 py-3 border-b border-border">
                <p class="text-sm font-medium text-popover-foreground">{{ auth.currentUser?.name }}</p>
                <p class="text-xs text-muted-foreground">{{ auth.currentUser?.email }}</p>
              </div>
              <a routerLink="/settings" class="flex items-center gap-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-muted-foreground"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                Configuración
              </a>
              <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Cerrar sesión
              </button>
            </div>
          }
        </div>
      </div>
    </header>

    @if (showNotifications) {
      <div class="fixed inset-0 z-40" (click)="showNotifications = false"></div>
      <div class="absolute right-8 top-16 mt-1 w-96 bg-popover rounded-xl border border-border shadow-lg overflow-hidden z-50">
        <div class="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <span class="text-sm font-semibold text-popover-foreground">Notificaciones</span>
          <button (click)="markAllRead()" class="text-xs text-muted-foreground hover:text-foreground transition-colors">Marcar todas leídas</button>
        </div>
        <div class="max-h-80 overflow-y-auto">
          @for (n of notifications; track n.id) {
            <div class="px-5 py-3.5 border-b border-border/50 hover:bg-accent cursor-pointer transition-colors"
                 (click)="markRead(n)">
              <div class="flex items-start gap-3">
                <span class="text-base mt-0.5">{{ getIcon(n.type) }}</span>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-foreground">{{ n.title }}</p>
                  <p class="text-xs text-muted-foreground mt-0.5 truncate">{{ n.message }}</p>
                  <p class="text-xs text-muted-foreground/60 mt-1">{{ n.createdAt | date:'short' }}</p>
                </div>
                @if (!n.isRead) {
                  <span class="w-1.5 h-1.5 bg-destructive rounded-full mt-2 shrink-0"></span>
                }
              </div>
            </div>
          } @empty {
            <div class="px-5 py-12 text-center text-muted-foreground text-sm">Sin notificaciones</div>
          }
        </div>
      </div>
    }
  `,
})
export class Navbar {
  pageTitle = '';
  showNotifications = false;
  showUserMenu = false;
  notifications: AppNotification[] = [];
  unreadCount: Observable<number> = of(0);

  constructor(public auth: AuthService, private notifService: NotificationService) {
    this.unreadCount = this.notifService.getUnreadCount();
    this.notifService.getAll().subscribe((n: AppNotification[]) => this.notifications = n);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
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

  getIcon(type: string): string {
    switch (type) {
      case 'LOW_STOCK': return '⚠️';
      case 'MOVEMENT': return '🔄';
      default: return '🔔';
    }
  }

  logout() {
    this.auth.logout();
  }
}
