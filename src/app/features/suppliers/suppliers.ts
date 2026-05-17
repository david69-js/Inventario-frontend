import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../../core/models/supplier.model';
import { SupplierService } from '../../core/services/supplier.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [FormsModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="page-header">
      <h1>Proveedores</h1>
      <p>Gestión de proveedores</p>
    </div>

    <mat-card>
      <div class="table-toolbar">
        <div></div>
        <button mat-stroked-button (click)="openNew()">
          <mat-icon>add</mat-icon>
          Nuevo Proveedor
        </button>
      </div>

      <table mat-table [dataSource]="suppliers">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Empresa</th>
          <td mat-cell *matCellDef="let s">{{ s.name }}</td>
        </ng-container>
        <ng-container matColumnDef="contactName">
          <th mat-header-cell *matHeaderCellDef>Contacto</th>
          <td mat-cell *matCellDef="let s">{{ s.contactName || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Email</th>
          <td mat-cell *matCellDef="let s">{{ s.email || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="phone">
          <th mat-header-cell *matHeaderCellDef>Teléfono</th>
          <td mat-cell *matCellDef="let s">{{ s.phone || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="productCount">
          <th mat-header-cell *matHeaderCellDef>Productos</th>
          <td mat-cell *matCellDef="let s">{{ s.productCount }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let s" class="actions-cell">
            <button mat-icon-button (click)="openEdit(s)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button (click)="deleteSup(s.id)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr mat-row *matRowDef="let row; columns: columns;"></tr>
      </table>
    </mat-card>

    @if (showModal) {
      <div class="modal-overlay" (click)="showModal = false">
        <mat-card class="modal-card" (click)="$event.stopPropagation()">
          <mat-card-header>
            <mat-card-title>{{ selected ? 'Editar' : 'Nuevo' }} Proveedor</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="save()" class="modal-form">
              <mat-form-field><mat-label>Nombre empresa</mat-label><input matInput [(ngModel)]="form.name" name="name" required></mat-form-field>
              <mat-form-field><mat-label>Contacto</mat-label><input matInput [(ngModel)]="form.contactName" name="contactName"></mat-form-field>
              <mat-form-field><mat-label>Email</mat-label><input matInput type="email" [(ngModel)]="form.email" name="email"></mat-form-field>
              <mat-form-field><mat-label>Teléfono</mat-label><input matInput [(ngModel)]="form.phone" name="phone"></mat-form-field>
              <mat-form-field><mat-label>Dirección</mat-label><input matInput [(ngModel)]="form.address" name="address"></mat-form-field>
              <div class="modal-actions">
                <button mat-button type="button" (click)="showModal = false">Cancelar</button>
                <button mat-raised-button color="primary" type="submit">Guardar</button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .actions-cell { text-align: right; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .modal-card { width: 100%; max-width: 440px; }
    .modal-form { display: flex; flex-direction: column; gap: 4px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
  `]
})
export class Suppliers implements OnInit {
  suppliers: Supplier[] = [];
  columns = ['name', 'contactName', 'email', 'phone', 'productCount', 'actions'];
  showModal = false;
  selected: Supplier | null = null;
  form: Partial<Supplier> = {};

  constructor(private service: SupplierService) {}

  ngOnInit() { this.service.getAll().subscribe((s: Supplier[]) => this.suppliers = s); }

  openNew() { this.selected = null; this.form = { name: '', contactName: '', email: '', phone: '', address: '' }; this.showModal = true; }

  openEdit(s: Supplier) { this.selected = s; this.form = { ...s }; this.showModal = true; }

  save() {
    if (this.selected) { this.service.update(this.selected.id, this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); }); }
    else { this.service.create(this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); }); }
  }

  deleteSup(id: string) { if (confirm('¿Eliminar este proveedor?')) this.service.delete(id).subscribe(() => this.ngOnInit()); }
}
