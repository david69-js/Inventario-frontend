import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-foreground">Categorías</h1>
          <p class="text-sm text-muted-foreground mt-1">Clasificación de productos</p>
        </div>
        <button (click)="openNew()"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-accent shadow-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nueva Categoría
        </button>
      </div>

      @if (showModal) {
        <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" (click)="showModal = false">
          <div class="bg-card rounded-xl w-full max-w-md p-6 shadow-xl" (click)="$event.stopPropagation()">
            <h3 class="text-base font-semibold text-foreground mb-4">{{ selected ? 'Editar' : 'Nueva' }} Categoría</h3>
            <form (ngSubmit)="save()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Nombre</label>
                <input type="text" [(ngModel)]="form.name" name="name" required
                       class="w-full px-3 py-2 rounded-md text-sm bg-input-background">
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Descripción</label>
                <textarea [(ngModel)]="form.description" name="description" rows="3"
                          class="w-full px-3 py-2 rounded-md text-sm bg-input-background"></textarea>
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
              <th class="px-4 py-3.5 font-medium">Nombre</th>
              <th class="px-4 py-3.5 font-medium">Descripción</th>
              <th class="px-4 py-3.5 font-medium">Productos</th>
              <th class="px-4 py-3.5 font-medium">Creada</th>
              <th class="px-4 py-3.5 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (c of categories; track c.id) {
              <tr class="border-b border-border/50 hover:bg-accent transition-colors">
                <td class="px-4 py-3 font-medium text-foreground">{{ c.name }}</td>
                <td class="px-4 py-3 text-muted-foreground/60 text-xs">{{ c.description || '—' }}</td>
                <td class="px-4 py-3 text-muted-foreground">{{ c.productCount }}</td>
                <td class="px-4 py-3 text-muted-foreground/60 text-xs">{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
                <td class="px-4 py-3 text-right">
                  <button (click)="openEdit(c)" class="text-sm text-muted-foreground hover:text-foreground font-medium mr-3 transition-colors">Editar</button>
                  <button (click)="deleteCat(c.id)" class="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="5" class="px-4 py-12 text-center text-muted-foreground text-sm">Sin categorías</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class Categories implements OnInit {
  categories: Category[] = [];
  showModal = false;
  selected: Category | null = null;
  form: Partial<Category> = {};

  constructor(private service: CategoryService) {}

  ngOnInit() {
    this.service.getAll().subscribe(c => this.categories = c);
  }

  openNew() {
    this.selected = null;
    this.form = { name: '', description: '' };
    this.showModal = true;
  }

  openEdit(c: Category) {
    this.selected = c;
    this.form = { ...c };
    this.showModal = true;
  }

  save() {
    if (this.selected) {
      this.service.update(this.selected.id, this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); });
    } else {
      this.service.create(this.form).subscribe(() => { this.showModal = false; this.ngOnInit(); });
    }
  }

  deleteCat(id: string) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.service.delete(id).subscribe(() => this.ngOnInit());
    }
  }
}
