import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-content>
          <div class="login-header">
            <div class="login-logo">I</div>
            <h1>Iniciar Sesión</h1>
            <p>Sistema de Gestión de Inventario</p>
          </div>

          <form (ngSubmit)="login()" class="login-form">
            <mat-form-field>
              <mat-label>Correo electrónico</mat-label>
              <input matInput type="email" [(ngModel)]="email" name="email" required placeholder="admin@inventario.com">
            </mat-form-field>

            <mat-form-field>
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required placeholder="123456">
            </mat-form-field>

            @if (error) {
              <div class="error-msg">{{ error }}</div>
            }

            <button mat-raised-button color="primary" type="submit" [disabled]="loading" class="full-width">
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </form>

          <div class="login-footer">
            <p class="test-cred-label">Credenciales de prueba</p>
            <div class="test-creds">
              <p><strong>Admin:</strong> admin@inventario.com / 123456</p>
              <p><strong>Manager:</strong> manager@inventario.com / 123456</p>
              <p><strong>Employee:</strong> employee@inventario.com / 123456</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; background: var(--mat-sys-surface); }
    .login-card { width: 100%; max-width: 400px; }
    .login-header { text-align: center; margin-bottom: 24px; }
    .login-logo { width: 48px; height: 48px; background: var(--mat-sys-primary); color: var(--mat-sys-on-primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; margin: 0 auto 16px; }
    .login-header h1 { font-size: 20px; font-weight: 500; margin: 0 0 4px; }
    .login-header p { font-size: 13px; color: var(--mat-sys-on-surface-variant); margin: 0; }
    .login-form { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .error-msg { font-size: 13px; color: var(--mat-sys-error); padding: 8px 12px; background: color-mix(in srgb, var(--mat-sys-error) 8%, transparent); border-radius: 6px; }
    .login-footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--mat-sys-outline-variant); }
    .test-cred-label { font-size: 11px; color: var(--mat-sys-on-surface-variant); text-align: center; margin: 0 0 8px; opacity: 0.6; }
    .test-creds { font-size: 12px; color: var(--mat-sys-on-surface-variant); line-height: 1.6; }
    .test-creds strong { color: var(--mat-sys-on-surface); }
  `]
})
export class Login {
  email = 'admin@inventario.com';
  password = '123456';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {
    localStorage.removeItem('inventario_token');
    localStorage.removeItem('inventario_user');
  }

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        if (user) { this.router.navigate(['/dashboard']); }
        else { this.error = 'Credenciales inválidas'; }
      },
      error: () => { this.loading = false; this.error = 'Error de conexión con el servidor'; },
    });
  }
}
