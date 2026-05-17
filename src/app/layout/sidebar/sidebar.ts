import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/user.model';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SlicePipe],
  template: `
    <aside class="w-60 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div class="h-16 flex items-center gap-3 px-5 border-b border-sidebar-border shrink-0">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">I</div>
        <div>
          <span class="text-sm font-semibold text-sidebar-foreground block leading-tight">Inventario</span>
          <span class="text-[11px] text-muted-foreground">Panel de control</span>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        @for (item of menuItems; track item.path) {
          @if (item.roles.length === 0 || auth.hasRole(item.roles)) {
            <a [routerLink]="item.path"
               routerLinkActive="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
               [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
               class="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-150">
              <span class="w-4 h-4 shrink-0" [innerHTML]="item.icon"></span>
              <span>{{ item.label }}</span>
            </a>
          }
        }
      </nav>

      <div class="px-3 py-3 border-t border-sidebar-border shrink-0">
        <a routerLink="/settings"
           routerLinkActive="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
           class="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-all duration-150">
          <span class="w-4 h-4 shrink-0" [innerHTML]="settingsIcon"></span>
          <span>Configuración</span>
        </a>
      </div>

      <div class="px-4 py-4 border-t border-sidebar-border shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
            {{ (auth.currentUser?.name ?? 'U') | slice:0:1 }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-sidebar-foreground truncate">{{ auth.currentUser?.name }}</p>
            <p class="text-xs text-muted-foreground truncate capitalize">{{ auth.currentUser?.role?.toLowerCase() }}</p>
          </div>
        </div>
      </div>
    </aside>
  `,
})
export class Sidebar {
  settingsIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;

  menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`, roles: [] },
    { path: '/products', label: 'Productos', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, roles: [] },
    { path: '/inventory', label: 'Inventario', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`, roles: [] },
    { path: '/categories', label: 'Categorías', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M4 20h4l10.5-10.5a2.5 2.5 0 0 0 0-3.5l-1.5-1.5a2.5 2.5 0 0 0-3.5 0L4 16v4z"/><path d="M14 4l4 4"/></svg>`, roles: [] },
    { path: '/suppliers', label: 'Proveedores', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`, roles: [] },
    { path: '/reports', label: 'Reportes', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`, roles: [] },
    { path: '/users', label: 'Usuarios', icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`, roles: [Role.ADMIN] },
  ];

  constructor(public auth: AuthService) {}
}
