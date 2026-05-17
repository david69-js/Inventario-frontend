import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryMovement, MovementType } from '../../core/models/inventory-movement.model';
import { Product } from '../../core/models/product.model';
import { InventoryService } from '../../core/services/inventory.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-foreground">Movimientos de Inventario</h1>
          <p class="text-sm text-muted-foreground mt-1">Registro de entradas, salidas y ajustes</p>
        </div>
        <div class="flex gap-2">
          <button (click)="openForm(MovementType.INCOMING)"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
            Entrada
          </button>
          <button (click)="openForm(MovementType.OUTGOING)"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            Salida
          </button>
          <button (click)="openForm(MovementType.ADJUSTMENT)"
                  class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Ajuste
          </button>
        </div>
      </div>

      @if (showForm) {
        <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showForm = false">
          <div class="bg-card rounded-xl w-full max-w-md p-6 shadow-xl" (click)="$event.stopPropagation()">
            <h3 class="text-base font-semibold text-foreground mb-4">
              Registrar {{ formType === MovementType.INCOMING ? 'Entrada' : formType === MovementType.OUTGOING ? 'Salida' : 'Ajuste' }}
            </h3>
            <form (ngSubmit)="register()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Producto</label>
                <select [(ngModel)]="formProductId" name="productId" required
                        class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
                  <option value="">Seleccionar...</option>
                  @for (p of products; track p.id) {
                    <option [value]="p.id">{{ p.name }} ({{ p.sku }})</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Cantidad</label>
                <input type="number" [(ngModel)]="formQuantity" name="quantity" required min="1"
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Descripción</label>
                <input type="text" [(ngModel)]="formDescription" name="description"
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div class="flex justify-end gap-3 pt-2">
                <button type="button" (click)="showForm = false"
                        class="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent transition-colors">Cancelar</button>
                <button type="submit"
                        class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">Registrar</button>
              </div>
            </form>
          </div>
        </div>
      }

      <div class="bg-card rounded-xl border border-border shadow-sm">
        <div class="p-4 border-b border-border flex gap-3">
          <select [(ngModel)]="filterType" (change)="applyFilters()"
                  class="px-3 py-2 rounded-md text-sm bg-input-background">
            <option value="">Todos los tipos</option>
            <option value="INCOMING">Entradas</option>
            <option value="OUTGOING">Salidas</option>
            <option value="ADJUSTMENT">Ajustes</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-muted-foreground border-b border-border">
                <th class="px-4 py-3.5 font-medium">Fecha</th>
                <th class="px-4 py-3.5 font-medium">Producto</th>
                <th class="px-4 py-3.5 font-medium">Tipo</th>
                <th class="px-4 py-3.5 font-medium">Cantidad</th>
                <th class="px-4 py-3.5 font-medium">Usuario</th>
                <th class="px-4 py-3.5 font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              @for (m of filteredMovements; track m.id) {
                <tr class="border-b border-border/50 hover:bg-accent transition-colors">
                  <td class="px-4 py-3 text-muted-foreground/60 text-xs">{{ m.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td class="px-4 py-3 font-medium text-foreground">{{ m.productName }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                          [class]="m.type === 'INCOMING' ? 'bg-emerald-50 text-emerald-700' : m.type === 'OUTGOING' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'">
                      {{ m.type === 'INCOMING' ? 'Entrada' : m.type === 'OUTGOING' ? 'Salida' : 'Ajuste' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-medium"
                      [class]="m.type === 'INCOMING' ? 'text-emerald-600' : m.type === 'OUTGOING' ? 'text-amber-600' : 'text-blue-600'">
                    {{ m.type === 'INCOMING' ? '+' : m.type === 'OUTGOING' ? '-' : '±' }}{{ m.quantity }}
                  </td>
                  <td class="px-4 py-3 text-muted-foreground">{{ m.userName }}</td>
                  <td class="px-4 py-3 text-muted-foreground/60 text-xs">{{ m.description || '—' }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-4 py-12 text-center text-muted-foreground text-sm">Sin movimientos registrados</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class Inventory implements OnInit {
  MovementType = MovementType;
  movements: InventoryMovement[] = [];
  filteredMovements: InventoryMovement[] = [];
  products: Product[] = [];
  filterType = '';
  showForm = false;
  formType: MovementType = MovementType.INCOMING;
  formProductId = '';
  formQuantity = 1;
  formDescription = '';

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.inventoryService.getAll().subscribe((m: InventoryMovement[]) => {
      this.movements = m;
      this.applyFilters();
    });
    this.productService.getAll().subscribe((p: Product[]) => this.products = p);
  }

  applyFilters() {
    this.filteredMovements = this.filterType
      ? this.movements.filter(m => m.type === this.filterType)
      : [...this.movements];
  }

  openForm(type: MovementType) {
    this.formType = type;
    this.formProductId = '';
    this.formQuantity = 1;
    this.formDescription = '';
    this.showForm = true;
  }

  register() {
    const qty = this.formType === MovementType.OUTGOING ? -this.formQuantity : this.formQuantity;
    this.inventoryService.register(this.formType, this.formProductId, qty, this.formDescription, this.auth.currentUser?.id).subscribe(() => {
      this.showForm = false;
      this.ngOnInit();
    });
  }
}
