import { Component, OnInit } from '@angular/core';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [DatePipe, MatTableModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-header">
      <h1>Usuarios</h1>
      <p>Gestión de usuarios del sistema</p>
    </div>

    <mat-card>
      <table mat-table [dataSource]="users">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Usuario</th>
          <td mat-cell *matCellDef="let u">
            <div class="user-cell">
              <div class="avatar">{{ u.name.charAt(0) }}</div>
              <span>{{ u.name }}</span>
            </div>
          </td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let u">{{ u.email }}</td>
        </ng-container>
        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Rol</th>
          <td mat-cell *matCellDef="let u">
            <mat-chip [color]="u.role === 'ADMIN' ? 'primary' : u.role === 'INVENTORY_MANAGER' ? 'accent' : ''" highlighted>
              {{ u.role === 'INVENTORY_MANAGER' ? 'Manager' : u.role === 'ADMIN' ? 'Admin' : 'Empleado' }}
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let u">
            <mat-chip [color]="u.isActive ? 'primary' : ''" highlighted>{{ u.isActive ? 'Activo' : 'Inactivo' }}</mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Creado</th>
          <td mat-cell *matCellDef="let u">{{ u.createdAt | date:'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let u" class="actions-cell">
            <button mat-icon-button matTooltip="Editar"><mat-icon>edit</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </mat-card>
  `,
  styles: [`
    .user-cell { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 32px; height: 32px; background: var(--mat-sys-surface-container-high); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: var(--mat-sys-on-surface-variant); }
    .actions-cell { text-align: right; }
  `]
})
export class Users implements OnInit {
  users: User[] = [];
  columns = ['name', 'email', 'role', 'status', 'createdAt', 'actions'];

  constructor(private userService: UserService) {}

  ngOnInit() { this.userService.getAll().subscribe(u => this.users = u); }
}
