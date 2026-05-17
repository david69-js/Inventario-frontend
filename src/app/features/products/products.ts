import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductStatus } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductModal } from './product-modal/product-modal';
import { CurrencyPipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, ProductModal, CurrencyPipe, SlicePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-foreground">Productos</h1>
          <p class="text-sm text-muted-foreground mt-1">Gestión de productos del inventario</p>
        </div>
        <button (click)="openNew()"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Producto
        </button>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm">
        <div class="p-4 border-b border-border flex flex-wrap gap-3">
          <input type="text" [(ngModel)]="search" (input)="applyFilters()" placeholder="Buscar por nombre o SKU..."
                 class="flex-1 min-w-[200px] px-3 py-2 rounded-md text-sm">
          <select [(ngModel)]="filterCategory" (change)="applyFilters()"
                  class="px-3 py-2 rounded-md text-sm bg-input-background">
            <option value="">Todas las categorías</option>
            @for (c of categories; track c.id) {
              <option [value]="c.id">{{ c.name }}</option>
            }
          </select>
          <select [(ngModel)]="filterStatus" (change)="applyFilters()"
                  class="px-3 py-2 rounded-md text-sm bg-input-background">
            <option value="">Todos los estados</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="DISCONTINUED">Descontinuado</option>
          </select>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-muted-foreground border-b border-border">
                <th class="px-4 py-3.5 font-medium">Producto</th>
                <th class="px-4 py-3.5 font-medium">SKU</th>
                <th class="px-4 py-3.5 font-medium">Stock</th>
                <th class="px-4 py-3.5 font-medium">Precio</th>
                <th class="px-4 py-3.5 font-medium">Categoría</th>
                <th class="px-4 py-3.5 font-medium">Estado</th>
                <th class="px-4 py-3.5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (p of filteredProducts; track p.id) {
                <tr class="border-b border-border/50 hover:bg-accent transition-colors">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs font-medium">
                        {{ p.name.charAt(0) }}
                      </div>
                      <div>
                        <p class="font-medium text-foreground">{{ p.name }}</p>
                        <p class="text-xs text-muted-foreground/60">{{ (p.description || 'Sin descripción') | slice:0:30 }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-muted-foreground font-mono text-xs">{{ p.sku }}</td>
                  <td class="px-4 py-3">
                    <span class="font-medium" [class]="p.stock <= p.minStock ? 'text-amber-600' : 'text-foreground'">
                      {{ p.stock }}
                    </span>
                    <span class="text-xs text-muted-foreground/60 ml-1">/ min {{ p.minStock }}</span>
                  </td>
                  <td class="px-4 py-3 text-foreground font-medium">{{ p.price | currency }}</td>
                  <td class="px-4 py-3 text-muted-foreground">{{ p.categoryName || '—' }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                          [class]="p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : p.status === 'INACTIVE' ? 'bg-muted text-muted-foreground' : 'bg-red-50 text-red-700'">
                      {{ p.status === 'ACTIVE' ? 'Activo' : p.status === 'INACTIVE' ? 'Inactivo' : 'Descont.' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button (click)="openEdit(p)" class="text-sm text-muted-foreground hover:text-foreground font-medium mr-3 transition-colors">Editar</button>
                    <button (click)="deleteProduct(p.id)" class="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors">Eliminar</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-4 py-12 text-center text-muted-foreground text-sm">No se encontraron productos</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-product-modal [visible]="showModal" [product]="selectedProduct"
                       (closeModal)="showModal = false"
                       (saved)="onSave($event)" />
  `,
})
export class Products implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  search = '';
  filterCategory = '';
  filterStatus = '';
  showModal = false;
  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe((p: Product[]) => {
      this.products = p;
      this.applyFilters();
    });
    this.categoryService.getAll().subscribe((c: Category[]) => this.categories = c);
  }

  applyFilters() {
    let result = [...this.products];
    if (this.search) {
      const s = this.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
    }
    if (this.filterCategory) {
      result = result.filter(p => p.categoryId === this.filterCategory);
    }
    if (this.filterStatus) {
      result = result.filter(p => p.status === this.filterStatus);
    }
    this.filteredProducts = result;
  }

  openNew() {
    this.selectedProduct = null;
    this.showModal = true;
  }

  openEdit(p: Product) {
    this.selectedProduct = p;
    this.showModal = true;
  }

  onSave(data: Partial<Product>) {
    if (this.selectedProduct) {
      this.productService.update(this.selectedProduct.id, data).subscribe(() => {
        this.ngOnInit();
        this.showModal = false;
      });
    } else {
      this.productService.create(data).subscribe(() => {
        this.ngOnInit();
        this.showModal = false;
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('¿Eliminar este producto?')) {
      this.productService.delete(id).subscribe(() => this.ngOnInit());
    }
  }
}
