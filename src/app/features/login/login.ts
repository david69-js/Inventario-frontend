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
      <div class="login-grid-bg"></div>
      <mat-card class="login-card">
        <mat-card-content>
          <div class="login-header">
            <div class="login-logo">
              <svg width="24" height="24" viewBox="0 0 76 65" fill="currentColor">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
              </svg>
            </div>
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

            <button mat-raised-button color="primary" type="submit" [disabled]="loading" class="login-btn">
              {{ loading ? 'Ingresando...' : 'Continuar' }}
            </button>
          </form>

          <div class="login-footer">
            <p class="test-cred-label">Credenciales de prueba</p>
            <div class="test-creds">
              <div class="cred-row">
                <span class="cred-role">Admin</span>
                <code>admin@inventario.com</code>
              </div>
              <div class="cred-row">
                <span class="cred-role">Manager</span>
                <code>manager@inventario.com</code>
              </div>
              <div class="cred-row">
                <span class="cred-role">Employee</span>
                <code>employee@inventario.com</code>
              </div>
              <p class="cred-pass">Contraseña: <code>123456</code></p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: var(--bg-body);
      position: relative;
      overflow: hidden;
    }

    .login-grid-bg {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 70%);
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      position: relative;
      z-index: 1;
      animation: scaleIn 0.3s ease;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg) !important;
    }

    .login-header {
      text-align: center;
      margin-bottom: 28px;
    }

    .login-logo {
      width: 52px;
      height: 52px;
      background: var(--accent);
      color: #ffffff;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      transition: transform 0.2s ease;
    }
    .login-logo:hover {
      transform: scale(1.05);
    }

    .login-header h1 {
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 4px;
      color: var(--text-primary);
      letter-spacing: -0.025em;
    }

    .login-header p {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .login-btn {
      width: 100%;
      height: 44px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      letter-spacing: -0.01em !important;
      margin-top: 8px !important;
      border-radius: 8px !important;
      background: var(--accent) !important;
      color: #fff !important;
    }
    .login-btn:hover {
      background: var(--accent-hover) !important;
    }

    .error-msg {
      font-size: 13px;
      color: var(--error);
      padding: 10px 14px;
      background: var(--error-bg);
      border: 1px solid var(--error-border);
      border-radius: 8px;
    }

    .login-footer {
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }

    .test-cred-label {
      font-size: 11px;
      color: var(--text-muted);
      text-align: center;
      margin: 0 0 12px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }

    .test-creds {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .cred-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: var(--bg-hover);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
    }

    .cred-role {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .cred-row code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--text-secondary);
      background: none;
      border: none;
      padding: 0;
    }

    .cred-pass {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      margin: 4px 0 0;
    }

    .cred-pass code {
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-secondary);
      background: var(--bg-hover);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--border);
    }
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
