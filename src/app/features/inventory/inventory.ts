import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryMovement, MovementType } from '../../core/models/inventory-movement.model';
import { Product } from '../../core/models/product.model';
import { InventoryService } from '../../core/services/inventory.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [FormsModule, DatePipe, MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule],
  template: `
    <div class="page-header">
      <h1>Movimientos de Inventario</h1>
      <p>Registro de entradas, salidas y ajustes</p>
    </div>

    <mat-card>
      <div class="table-toolbar">
        <mat-form-field subscriptSizing="dynamic">
          <mat-label>Filtrar tipo</mat-label>
          <mat-select [(ngModel)]="filterType" (selectionChange)="applyFilters()">
            <mat-option value="">Todos</mat-option>
            <mat-option value="INCOMING">Entradas</mat-option>
            <mat-option value="OUTGOING">Salidas</mat-option>
            <mat-option value="ADJUSTMENT">Ajustes</mat-option>
          </mat-select>
        </mat-form-field>
        <div class="action-buttons">
          <button mat-stroked-button (click)="openForm(MovementType.INCOMING)"><mat-icon>add_circle</mat-icon> Entrada</button>
          <button mat-stroked-button (click)="openForm(MovementType.OUTGOING)"><mat-icon>remove_circle</mat-icon> Salida</button>
          <button mat-stroked-button (click)="openForm(MovementType.ADJUSTMENT)"><mat-icon>tune</mat-icon> Ajuste</button>
        </div>
      </div>

      <table mat-table [dataSource]="filteredMovements">
        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Fecha</th>
          <td mat-cell *matCellDef="let m">{{ m.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
        </ng-container>
        <ng-container matColumnDef="productName">
          <th mat-header-cell *matHeaderCellDef>Producto</th>
          <td mat-cell *matCellDef="let m">{{ m.productName }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef>Tipo</th>
          <td mat-cell *matCellDef="let m">
            <mat-chip [color]="m.type === 'INCOMING' ? 'primary' : m.type === 'OUTGOING' ? 'warn' : 'accent'" highlighted>
              {{ m.type === 'INCOMING' ? 'Entrada' : m.type === 'OUTGOING' ? 'Salida' : 'Ajuste' }}
            </mat-chip>
          </td>
        </ng-container>
        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Cantidad</th>
          <td mat-cell *matCellDef="let m">
            <span [style.color]="m.type === 'INCOMING' ? 'var(--mat-sys-primary)' : m.type === 'OUTGOING' ? 'var(--mat-sys-error)' : 'var(--mat-sys-tertiary)'" style="font-weight: 500;">
              {{ m.type === 'INCOMING' ? '+' : m.type === 'OUTGOING' ? '-' : '±' }}{{ m.quantity }}
            </span>
          </td>
        </ng-container>
        <ng-container matColumnDef="userName">
          <th mat-header-cell *matHeaderCellDef>Usuario</th>
          <td mat-cell *matCellDef="let m">{{ m.userName }}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Descripción</th>
          <td mat-cell *matCellDef="let m">{{ m.description || '—' }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </mat-card>

    @if (showForm) {
      <div class="modal-overlay" (click)="showForm = false">
        <mat-card class="modal-card" (click)="$event.stopPropagation()">
          <mat-card-header>
            <mat-card-title>
              Registrar {{ formType === MovementType.INCOMING ? 'Entrada' : formType === MovementType.OUTGOING ? 'Salida' : 'Ajuste' }}
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="register()" class="modal-form">
              <mat-form-field>
                <mat-label>Producto</mat-label>
                <mat-select [(ngModel)]="formProductId" name="productId" required>
                  <mat-option value="">Seleccionar...</mat-option>
                  @for (p of products; track p.id) {
                    <mat-option [value]="p.id">{{ p.name }} ({{ p.sku }})</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field>
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" [(ngModel)]="formQuantity" name="quantity" required min="1">
              </mat-form-field>
              <mat-form-field>
                <mat-label>Descripción</mat-label>
                <input matInput [(ngModel)]="formDescription" name="description">
              </mat-form-field>
              <div class="modal-actions">
                <button mat-button type="button" (click)="showForm = false">Cancelar</button>
                <button mat-raised-button color="primary" type="submit">Registrar</button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .action-buttons { display: flex; gap: 8px; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .modal-card { width: 100%; max-width: 440px; }
    .modal-form { display: flex; flex-direction: column; gap: 4px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
  `]
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
  columns = ['createdAt', 'productName', 'type', 'quantity', 'userName', 'description'];

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.inventoryService.getAll().subscribe((m: InventoryMovement[]) => { this.movements = m; this.applyFilters(); });
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
