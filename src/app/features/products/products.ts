import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductStatus } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductModal } from './product-modal/product-modal';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, MatTableModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule, MatTooltipModule],
  template: `
    <div class="page-header">
      <h1>Productos</h1>
      <p>Gestión de productos del inventario</p>
    </div>

    <mat-card>
      <div class="table-toolbar">
        <div class="filters">
          <mat-form-field subscriptSizing="dynamic">
            <mat-label>Buscar</mat-label>
            <input matInput [(ngModel)]="search" (input)="applyFilters()" placeholder="Nombre o SKU">
          </mat-form-field>
          <mat-form-field subscriptSizing="dynamic">
            <mat-label>Categoría</mat-label>
            <mat-select [(ngModel)]="filterCategory" (selectionChange)="applyFilters()">
              <mat-option value="">Todas</mat-option>
              @for (c of categories; track c.id) {
                <mat-option [value]="c.id">{{ c.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field subscriptSizing="dynamic">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="filterStatus" (selectionChange)="applyFilters()">
              <mat-option value="">Todos</mat-option>
              <mat-option value="ACTIVE">Activo</mat-option>
              <mat-option value="INACTIVE">Inactivo</mat-option>
              <mat-option value="DISCONTINUED">Descontinuado</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <button mat-stroked-button (click)="openNew()">
          <mat-icon>add</mat-icon>
          Nuevo Producto
        </button>
      </div>

      <table mat-table [dataSource]="filteredProducts">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Producto</th>
          <td mat-cell *matCellDef="let p">{{ p.name }}</td>
        </ng-container>
        <ng-container matColumnDef="sku">
          <th mat-header-cell *matHeaderCellDef>SKU</th>
          <td mat-cell *matCellDef="let p"><code>{{ p.sku }}</code></td>
        </ng-container>
        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef>Stock</th>
          <td mat-cell *matCellDef="let p">
            <span [class]="p.stock <= p.minStock ? 'warn-text' : ''">{{ p.stock }}</span>
            <span class="muted">/ min {{ p.minStock }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Precio</th>
          <td mat-cell *matCellDef="let p">{{ p.price | currency }}</td>
        </ng-container>
        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef>Categoría</th>
          <td mat-cell *matCellDef="let p">{{ p.categoryName || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Estado</th>
          <td mat-cell *matCellDef="let p">
            <mat-chip [color]="p.status === 'ACTIVE' ? 'primary' : p.status === 'INACTIVE' ? '' : 'warn'" highlighted>
              {{ p.status === 'ACTIVE' ? 'Activo' : p.status === 'INACTIVE' ? 'Inactivo' : 'Descont.' }}
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let p" class="actions-cell">
            <button mat-icon-button (click)="openEdit(p)" matTooltip="Editar"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button (click)="deleteProduct(p.id)" matTooltip="Eliminar"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </mat-card>
  `,
  styles: [`
    .actions-cell { text-align: right; }
    .warn-text { color: var(--mat-sys-error); font-weight: 500; }
    .muted { color: var(--mat-sys-on-surface-variant); font-size: 12px; margin-left: 4px; }
    code { font-family: 'Roboto Mono', monospace; font-size: 12px; }
  `]
})
export class Products implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  search = '';
  filterCategory = '';
  filterStatus = '';
  columns = ['name', 'sku', 'stock', 'price', 'category', 'status', 'actions'];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe((p: Product[]) => { this.products = p; this.applyFilters(); });
    this.categoryService.getAll().subscribe((c: Category[]) => this.categories = c);
  }

  applyFilters() {
    let result = [...this.products];
    if (this.search) {
      const s = this.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
    }
    if (this.filterCategory) result = result.filter(p => p.categoryId === this.filterCategory);
    if (this.filterStatus) result = result.filter(p => p.status === this.filterStatus);
    this.filteredProducts = result;
  }

  openNew() {
    const ref = this.dialog.open(ProductModal, { data: { product: null } });
    ref.afterClosed().subscribe(data => { if (data) this.productService.create(data).subscribe(() => this.ngOnInit()); });
  }

  openEdit(p: Product) {
    const ref = this.dialog.open(ProductModal, { data: { product: p } });
    ref.afterClosed().subscribe(data => { if (data) this.productService.update(p.id, data).subscribe(() => this.ngOnInit()); });
  }

  deleteProduct(id: string) {
    if (confirm('¿Eliminar este producto?')) this.productService.delete(id).subscribe(() => this.ngOnInit());
  }
}
