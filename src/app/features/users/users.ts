import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-lg font-semibold text-foreground">Usuarios</h1>
        <p class="text-sm text-muted-foreground mt-1">Gestión de usuarios del sistema</p>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-muted-foreground border-b border-border">
              <th class="px-4 py-3.5 font-medium">Usuario</th>
              <th class="px-4 py-3.5 font-medium">Email</th>
              <th class="px-4 py-3.5 font-medium">Rol</th>
              <th class="px-4 py-3.5 font-medium">Estado</th>
              <th class="px-4 py-3.5 font-medium">Creado</th>
              <th class="px-4 py-3.5 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (u of users; track u.id) {
              <tr class="border-b border-border/50 hover:bg-accent transition-colors">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                      {{ u.name.charAt(0) }}
                    </div>
                    <span class="font-medium text-foreground">{{ u.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-muted-foreground">{{ u.email }}</td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                        [class]="u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : u.role === 'INVENTORY_MANAGER' ? 'bg-blue-50 text-blue-700' : 'bg-muted text-muted-foreground'">
                    {{ u.role === 'INVENTORY_MANAGER' ? 'Manager' : u.role === 'ADMIN' ? 'Admin' : 'Empleado' }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center gap-1.5 text-xs" [class]="u.isActive ? 'text-emerald-600' : 'text-red-500'">
                    <span class="w-1.5 h-1.5 rounded-full" [class]="u.isActive ? 'bg-emerald-500' : 'bg-red-500'"></span>
                    {{ u.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-muted-foreground/60 text-xs">{{ u.createdAt | date:'dd/MM/yyyy' }}</td>
                <td class="px-4 py-3 text-right">
                  <button class="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">Editar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class Users implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAll().subscribe(u => this.users = u);
  }
}
