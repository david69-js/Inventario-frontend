import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { Supplier } from '../../../core/models/supplier.model';
import { CategoryService } from '../../../core/services/category.service';
import { SupplierService } from '../../../core/services/supplier.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (visible) {
      <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="close()">
        <div class="bg-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 class="text-base font-semibold text-foreground">{{ product ? 'Editar' : 'Nuevo' }} Producto</h3>
            <button (click)="close()" class="text-muted-foreground hover:text-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form (ngSubmit)="save()" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-foreground mb-1">Nombre</label>
                <input type="text" [(ngModel)]="form.name" name="name" required
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">SKU</label>
                <input type="text" [(ngModel)]="form.sku" name="sku" required
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Estado</label>
                <select [(ngModel)]="form.status" name="status"
                        class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
                  <option value="ACTIVE">Activo</option>
                  <option value="INACTIVE">Inactivo</option>
                  <option value="DISCONTINUED">Descontinuado</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Precio</label>
                <input type="number" step="0.01" [(ngModel)]="form.price" name="price" required
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Stock</label>
                <input type="number" [(ngModel)]="form.stock" name="stock" required
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Stock Mínimo</label>
                <input type="number" [(ngModel)]="form.minStock" name="minStock" required
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Categoría</label>
                <select [(ngModel)]="form.categoryId" name="categoryId"
                        class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
                  <option value="">Seleccionar...</option>
                  @for (c of categories; track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Proveedor</label>
                <select [(ngModel)]="form.supplierId" name="supplierId"
                        class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
                  <option value="">Seleccionar...</option>
                  @for (s of suppliers; track s.id) {
                    <option [value]="s.id">{{ s.name }}</option>
                  }
                </select>
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-foreground mb-1">Descripción</label>
                <textarea [(ngModel)]="form.description" name="description" rows="3"
                          class="w-full px-3 py-2 rounded-md text-sm bg-input-background"></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-border">
              <button type="button" (click)="close()"
                      class="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-accent transition-colors">Cancelar</button>
              <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class ProductModal implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() product: Product | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Partial<Product>>();

  form: Partial<Product> = {};
  categories: Category[] = [];
  suppliers: Supplier[] = [];

  constructor(
    private catService: CategoryService,
    private supService: SupplierService
  ) {}

  ngOnInit() {
    this.catService.getAll().subscribe((c: Category[]) => this.categories = c);
    this.supService.getAll().subscribe((s: Supplier[]) => this.suppliers = s);
  }

  ngOnChanges() {
    this.form = this.product ? { ...this.product } : {
      name: '', sku: '', price: 0, stock: 0, minStock: 0,
      status: ProductStatus.ACTIVE, categoryId: '', supplierId: '', description: '',
    };
  }

  save() {
    this.saved.emit(this.form);
  }

  close() {
    this.closeModal.emit();
  }
}
