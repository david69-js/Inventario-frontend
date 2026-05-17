import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
      <div class="w-full max-w-sm">
        <div class="bg-card rounded-xl shadow-sm border border-border p-8">
          <div class="text-center mb-8">
            <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span class="text-primary-foreground text-xl font-bold">I</span>
            </div>
            <h1 class="text-xl font-semibold text-foreground">Iniciar Sesión</h1>
            <p class="text-sm text-muted-foreground mt-1.5">Sistema de Gestión de Inventario</p>
          </div>

          <form (ngSubmit)="login()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1.5">Correo electrónico</label>
              <input type="email" [(ngModel)]="email" name="email" required
                     class="w-full px-3.5 py-2.5 rounded-md text-sm bg-input-background"
                     placeholder="admin@inventario.com">
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <input type="password" [(ngModel)]="password" name="password" required
                     class="w-full px-3.5 py-2.5 rounded-md text-sm bg-input-background"
                     placeholder="123456">
            </div>

            @if (error) {
              <div class="bg-destructive/5 text-destructive text-sm px-4 py-2.5 rounded-md">
                {{ error }}
              </div>
            }

            <button type="submit" [disabled]="loading"
                    class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
          </form>

          <div class="mt-6 pt-6 border-t border-border">
            <p class="text-xs text-muted-foreground/60 text-center mb-3">Credenciales de prueba</p>
            <div class="space-y-1.5 text-xs text-muted-foreground">
              <p><span class="font-medium text-foreground">Admin:</span> admin@inventario.com / 123456</p>
              <p><span class="font-medium text-foreground">Manager:</span> manager@inventario.com / 123456</p>
              <p><span class="font-medium text-foreground">Employee:</span> employee@inventario.com / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
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
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Credenciales inválidas';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Error de conexión con el servidor';
      },
    });
  }
}
