import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../core/models/supplier.model';
import { SupplierService } from '../../core/services/supplier.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-foreground">Proveedores</h1>
          <p class="text-sm text-muted-foreground mt-1">Gestión de proveedores</p>
        </div>
        <button (click)="openNew()"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Proveedor
        </button>
      </div>

      @if (showModal) {
        <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = false">
          <div class="bg-card rounded-xl w-full max-w-md p-6 shadow-xl" (click)="$event.stopPropagation()">
            <h3 class="text-base font-semibold text-foreground mb-4">{{ selected ? 'Editar' : 'Nuevo' }} Proveedor</h3>
            <form (ngSubmit)="save()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Nombre empresa</label>
                <input type="text" [(ngModel)]="form.name" name="name" required
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Contacto</label>
                <input type="text" [(ngModel)]="form.contactName" name="contactName"
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Email</label>
                <input type="email" [(ngModel)]="form.email" name="email"
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Teléfono</label>
                <input type="text" [(ngModel)]="form.phone" name="phone"
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Dirección</label>
                <input type="text" [(ngModel)]="form.address" name="address"
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <button type="button" (click)="showModal = false"
                        class="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent transition-colors">Cancelar</button>
                <button type="submit"
                        class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      }

      <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-muted-foreground border-b border-border">
              <th class="px-4 py-3.5 font-medium">Empresa</th>
              <th class="px-4 py-3.5 font-medium">Contacto</th>
              <th class="px-4 py-3.5 font-medium">Email</th>
              <th class="px-4 py-3.5 font-medium">Teléfono</th>
              <th class="px-4 py-3.5 font-medium">Productos</th>
              <th class="px-4 py-3.5 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (s of suppliers; track s.id) {
              <tr class="border-b border-border/50 hover:bg-accent transition-colors">
                <td class="px-4 py-3 font-medium text-foreground">{{ s.name }}</td>
                <td class="px-4 py-3 text-muted-foreground text-xs">{{ s.contactName || '—' }}</td>
                <td class="px-4 py-3 text-muted-foreground/60 text-xs">{{ s.email || '—' }}</td>
                <td class="px-4 py-3 text-muted-foreground/60 text-xs">{{ s.phone || '—' }}</td>
                <td class="px-4 py-3 text-muted-foreground">{{ s.productCount }}</td>
                <td class="px-4 py-3 text-right">
                  <button (click)="openEdit(s)" class="text-sm text-muted-foreground hover:text-foreground font-medium mr-3 transition-colors">Editar</button>
                  <button (click)="deleteSup(s.id)" class="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="px-4 py-12 text-center text-muted-foreground text-sm">Sin proveedores</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class Suppliers implements OnInit {
  suppliers: Supplier[] = [];
  showModal = false;
  selected: Supplier | null = null;
  form: Partial<Supplier> = {};

  constructor(private service: SupplierService) {}

  ngOnInit() {
    this.service.getAll().subscribe((s: Supplier[]) => this.suppliers = s);
  }

  openNew() {
    this.selected = null;
    this.form = { name: '', contactName: '', email: '', phone: '', address: '' };
    this.showModal = true;
  }

  openEdit(s: Supplier) {
    this.selected = s;
    this.form = { ...s };
    this.showModal = true;
  }

  save() {
    if (this.selected) {
      this.service.update(this.selected.id, this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); });
    } else {
      this.service.create(this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); });
    }
  }

  deleteSup(id: string) {
    if (confirm('¿Eliminar este proveedor?')) {
      this.service.delete(id).subscribe(() => this.ngOnInit());
    }
  }
}
