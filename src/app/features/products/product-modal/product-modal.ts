import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { Supplier } from '../../../core/models/supplier.model';
import { CategoryService } from '../../../core/services/category.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>{{ data.product ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
    <mat-dialog-content>
      <form #productForm="ngForm" class="form-grid">
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="form.name" name="name" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>SKU</mat-label>
          <input matInput [(ngModel)]="form.sku" name="sku" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Estado</mat-label>
          <mat-select [(ngModel)]="form.status" name="status">
            <mat-option value="ACTIVE">Activo</mat-option>
            <mat-option value="INACTIVE">Inactivo</mat-option>
            <mat-option value="DISCONTINUED">Descontinuado</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Precio</mat-label>
          <input matInput type="number" step="0.01" [(ngModel)]="form.price" name="price" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Stock</mat-label>
          <input matInput type="number" [(ngModel)]="form.stock" name="stock" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Stock Mínimo</mat-label>
          <input matInput type="number" [(ngModel)]="form.minStock" name="minStock" required>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Categoría</mat-label>
          <mat-select [(ngModel)]="form.categoryId" name="categoryId">
            <mat-option value="">Seleccionar...</mat-option>
            @for (c of categories; track c.id) {
              <mat-option [value]="c.id">{{ c.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Proveedor</mat-label>
          <mat-select [(ngModel)]="form.supplierId" name="supplierId">
            <mat-option value="">Seleccionar...</mat-option>
            @for (s of suppliers; track s.id) {
              <mat-option [value]="s.id">{{ s.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput [(ngModel)]="form.description" name="description" rows="2"></textarea>
        </mat-form-field>
        <div class="full-width image-section">
          <div class="image-input-row">
            <mat-form-field class="image-url-field">
              <mat-label>URL de imagen</mat-label>
              <input matInput [(ngModel)]="form.imageUrl" name="imageUrl" placeholder="https://ejemplo.com/imagen.jpg">
            </mat-form-field>
            <button mat-stroked-button type="button" (click)="fileInput.click()">
              <mat-icon>upload</mat-icon>
              Subir
            </button>
            <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" hidden>
          </div>
          @if (form.imageUrl) {
            <div class="image-preview-wrapper">
              <img [src]="form.imageUrl" class="image-preview" (error)="form.imageUrl = ''">
              <button mat-icon-button type="button" class="remove-image" (click)="form.imageUrl = ''">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; min-width: 500px; }
    .full-width { grid-column: 1 / -1; }
    .image-section { display: flex; flex-direction: column; gap: 8px; }
    .image-input-row { display: flex; gap: 8px; align-items: center; }
    .image-url-field { flex: 1; }
    .image-preview-wrapper { position: relative; width: 120px; border-radius: 8px; overflow: hidden; border: 1px solid var(--mat-sys-outline-variant); }
    .image-preview { width: 120px; height: 80px; object-fit: cover; display: block; }
    .remove-image { position: absolute; top: 2px; right: 2px; width: 24px; height: 24px; line-height: 24px; background: rgba(0,0,0,0.5); color: white; --mat-icon-button-touch-target-display: none; }
  `]
})
export class ProductModal implements OnInit {
  form: Partial<Product> = {};
  categories: Category[] = [];
  suppliers: Supplier[] = [];
  uploading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { product: Product | null },
    private dialogRef: MatDialogRef<ProductModal>,
    private catService: CategoryService,
    private supService: SupplierService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.catService.getAll().subscribe((c: Category[]) => this.categories = c);
    this.supService.getAll().subscribe((s: Supplier[]) => this.suppliers = s);
    this.form = this.data.product ? { ...this.data.product } : {
      name: '', sku: '', price: 0, stock: 0, minStock: 0,
      status: ProductStatus.ACTIVE, categoryId: '', supplierId: '', description: '', imageUrl: '',
    };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.uploading = true;
    const fd = new FormData();
    fd.append('file', file);
    const baseUrl = environment.apiUrl.replace(/\/api$/, '');
    this.http.post<{ url: string }>(`${baseUrl}/api/upload`, fd).subscribe({
      next: (res) => { this.form.imageUrl = baseUrl + res.url; this.uploading = false; },
      error: () => { alert('Error al subir la imagen'); this.uploading = false; },
    });
  }

  save() { this.dialogRef.close(this.form); }
}
