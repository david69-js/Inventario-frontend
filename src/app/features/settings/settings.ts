import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, DatePipe, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="page-header">
      <h1>Configuración</h1>
      <p>Administra tu perfil y preferencias</p>
    </div>

    <div class="settings-grid">
      <mat-card>
        <mat-card-header><mat-card-title>Perfil</mat-card-title></mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="updateProfile()" class="settings-form">
            <mat-form-field>
              <mat-label>Nombre</mat-label>
              <input matInput [(ngModel)]="form.name" name="name">
            </mat-form-field>
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="form.email" name="email">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Guardar Cambios</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header><mat-card-title>Cambiar Contraseña</mat-card-title></mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="changePassword()" class="settings-form">
            <mat-form-field>
              <mat-label>Nueva Contraseña</mat-label>
              <input matInput type="password" [(ngModel)]="passwordForm.newPassword" name="newPassword">
            </mat-form-field>
            <mat-form-field>
              <mat-label>Confirmar Contraseña</mat-label>
              <input matInput type="password" [(ngModel)]="passwordForm.confirmPassword" name="confirmPassword">
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Actualizar Contraseña</button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header><mat-card-title>Información de la Cuenta</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="info-rows">
            <div class="info-row"><span class="info-label">Rol:</span><span>{{ auth.currentUser?.role }}</span></div>
            <div class="info-row"><span class="info-label">Miembro desde:</span><span>{{ auth.currentUser?.createdAt | date:'longDate' }}</span></div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-grid { display: flex; flex-direction: column; gap: 20px; max-width: 560px; }
    .settings-form { display: flex; flex-direction: column; gap: 4px; }
    .settings-form button { align-self: flex-start; margin-top: 8px; }
    .info-rows { display: flex; flex-direction: column; gap: 12px; font-size: 14px; }
    .info-row { display: flex; gap: 8px; }
    .info-label { color: var(--mat-sys-on-surface-variant); min-width: 140px; }
  `]
})
export class Settings {
  form = { name: '', email: '' };
  passwordForm = { newPassword: '', confirmPassword: '' };

  constructor(public auth: AuthService) {
    if (auth.currentUser) this.form = { name: auth.currentUser.name, email: auth.currentUser.email };
  }

  updateProfile() {
    if (this.auth.currentUser) {
      this.auth.updateProfile(this.auth.currentUser.id, this.form).subscribe({
        next: () => alert('Perfil actualizado'),
        error: () => alert('Error al actualizar el perfil'),
      });
    }
  }

  changePassword() {
    if (!this.passwordForm.newPassword || this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('Las contraseñas no coinciden'); return;
    }
    this.auth.changePassword('', this.passwordForm.newPassword).subscribe({
      next: () => { alert('Contraseña actualizada correctamente'); this.passwordForm = { newPassword: '', confirmPassword: '' }; },
      error: (err) => alert(err.error?.message || 'Error al cambiar la contraseña'),
    });
  }
}
