import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6 max-w-2xl">
      <div>
        <h1 class="text-lg font-semibold text-foreground">Configuración</h1>
        <p class="text-sm text-muted-foreground mt-1">Administra tu perfil y preferencias</p>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 class="text-sm font-semibold text-foreground mb-5">Perfil</h3>
        <form (ngSubmit)="updateProfile()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Nombre</label>
            <input type="text" [(ngModel)]="form.name" name="name"
                   class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" [(ngModel)]="form.email" name="email"
                   class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
          </div>
          <div class="flex justify-end">
            <button type="submit"
                    class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">Guardar Cambios</button>
          </div>
        </form>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 class="text-sm font-semibold text-foreground mb-5">Cambiar Contraseña</h3>
        <form (ngSubmit)="changePassword()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Nueva Contraseña</label>
            <input type="password" [(ngModel)]="passwordForm.newPassword" name="newPassword"
                   class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Confirmar Contraseña</label>
            <input type="password" [(ngModel)]="passwordForm.confirmPassword" name="confirmPassword"
                   class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
          </div>
          <div class="flex justify-end">
            <button type="submit"
                    class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">Actualizar Contraseña</button>
          </div>
        </form>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm p-6">
        <h3 class="text-sm font-semibold text-foreground mb-5">Información de la Cuenta</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground w-28">Rol:</span>
            <span class="font-medium text-foreground">{{ auth.currentUser?.role }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground w-28">Miembro desde:</span>
            <span class="font-medium text-foreground">{{ auth.currentUser?.createdAt | date:'longDate' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Settings {
  form = { name: '', email: '' };
  passwordForm = { newPassword: '', confirmPassword: '' };

  constructor(public auth: AuthService, private userService: UserService) {
    if (auth.currentUser) {
      this.form = { name: auth.currentUser.name, email: auth.currentUser.email };
    }
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
      alert('Las contraseñas no coinciden');
      return;
    }
    this.auth.changePassword('', this.passwordForm.newPassword).subscribe({
      next: () => {
        alert('Contraseña actualizada correctamente');
        this.passwordForm = { newPassword: '', confirmPassword: '' };
      },
      error: (err) => {
        alert(err.error?.message || 'Error al cambiar la contraseña');
      },
    });
  }
}
