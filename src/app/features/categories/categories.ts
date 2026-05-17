import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, DatePipe, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="page-header">
      <h1>Categorías</h1>
      <p>Clasificación de productos</p>
    </div>

    <mat-card>
      <div class="table-toolbar">
        <div></div>
        <button mat-stroked-button (click)="openNew()">
          <mat-icon>add</mat-icon>
          Nueva Categoría
        </button>
      </div>

      <table mat-table [dataSource]="categories">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let c">{{ c.name }}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Descripción</th>
          <td mat-cell *matCellDef="let c">{{ c.description || '—' }}</td>
        </ng-container>
        <ng-container matColumnDef="productCount">
          <th mat-header-cell *matHeaderCellDef>Productos</th>
          <td mat-cell *matCellDef="let c">{{ c.productCount }}</td>
        </ng-container>
        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Creada</th>
          <td mat-cell *matCellDef="let c">{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let c" class="actions-cell">
            <button mat-icon-button (click)="openEdit(c)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button (click)="deleteCat(c.id)"><mat-icon>delete</mat-icon></button>
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
            <mat-card-title>{{ selected ? 'Editar' : 'Nueva' }} Categoría</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form (ngSubmit)="save()" class="modal-form">
              <mat-form-field><mat-label>Nombre</mat-label><input matInput [(ngModel)]="form.name" name="name" required></mat-form-field>
              <mat-form-field><mat-label>Descripción</mat-label><textarea matInput [(ngModel)]="form.description" name="description" rows="3"></textarea></mat-form-field>
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
export class Categories implements OnInit {
  categories: Category[] = [];
  columns = ['name', 'description', 'productCount', 'createdAt', 'actions'];
  showModal = false;
  selected: Category | null = null;
  form: Partial<Category> = {};

  constructor(private service: CategoryService) {}

  ngOnInit() { this.service.getAll().subscribe(c => this.categories = c); }

  openNew() { this.selected = null; this.form = { name: '', description: '' }; this.showModal = true; }

  openEdit(c: Category) { this.selected = c; this.form = { ...c }; this.showModal = true; }

  save() {
    if (this.selected) { this.service.update(this.selected.id, this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); }); }
    else { this.service.create(this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); }); }
  }

  deleteCat(id: string) { if (confirm('¿Eliminar esta categoría?')) this.service.delete(id).subscribe(() => this.ngOnInit()); }
}
