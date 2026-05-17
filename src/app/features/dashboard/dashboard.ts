import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { DashboardData } from '../../core/models/dashboard.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-foreground">Dashboard</h1>
          <p class="text-sm text-muted-foreground mt-1">Resumen general del inventario</p>
        </div>
        <div class="flex items-center gap-2 text-xs text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border shadow-sm">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Actualizado en tiempo real</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Productos</span>
            <div class="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-muted-foreground"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-foreground">{{ data?.totalProducts }}</p>
          <p class="text-xs text-muted-foreground/60 mt-1">Productos registrados</p>
        </div>

        <div class="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Stock Bajo</span>
            <div class="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-amber-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-foreground">{{ data?.lowStockProducts }}</p>
          <p class="text-xs text-muted-foreground/60 mt-1">Requieren reposición</p>
        </div>

        <div class="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor Inventario</span>
            <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-blue-600"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-foreground">{{ data?.inventoryValue | currency }}</p>
          <p class="text-xs text-muted-foreground/60 mt-1">Valor total en stock</p>
        </div>

        <div class="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mov. del Mes</span>
            <div class="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-emerald-600"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-foreground">{{ data?.monthlyMovements }}</p>
          <p class="text-xs text-muted-foreground/60 mt-1">Movimientos registrados</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-5">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-sm font-semibold text-foreground">Movimientos Mensuales</h3>
            <div class="flex gap-4 text-xs text-muted-foreground">
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-foreground rounded-sm"></span> Entradas</span>
              <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-muted-foreground rounded-sm"></span> Salidas</span>
            </div>
          </div>
          <div class="flex items-end gap-2 h-48">
            @for (m of data?.movementsByMonth; track m.month) {
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <div class="w-full flex gap-0.5 rounded-sm overflow-hidden" style="height: 140px;">
                  <div class="flex-1 bg-foreground rounded-sm transition-all duration-300 hover:opacity-80"
                       [style.height.%]="(m.incoming / getMaxMovement()) * 100"></div>
                  <div class="flex-1 bg-muted-foreground rounded-sm transition-all duration-300 hover:opacity-80"
                       [style.height.%]="(m.outgoing / getMaxMovement()) * 100"></div>
                </div>
                <span class="text-[11px] text-muted-foreground font-medium">{{ m.month }}</span>
              </div>
            }
          </div>
        </div>

        <div class="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 class="text-sm font-semibold text-foreground mb-5">Productos por Categoría</h3>
          <div class="space-y-4">
            @for (c of data?.productsByCategory; track c.category) {
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm text-muted-foreground">{{ c.category }}</span>
                  <span class="text-sm font-medium text-foreground">{{ c.count }}</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div class="h-full bg-foreground rounded-full transition-all duration-500"
                       [style.width.%]="(c.count / maxCategoryCount) * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm p-5">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-sm font-semibold text-foreground">Actividad Reciente</h3>
          <span class="text-xs text-muted-foreground/60">Últimos movimientos</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-muted-foreground border-b border-border">
                <th class="pb-3.5 pr-6 font-medium">Producto</th>
                <th class="pb-3.5 pr-6 font-medium">Tipo</th>
                <th class="pb-3.5 pr-6 font-medium">Cantidad</th>
                <th class="pb-3.5 pr-6 font-medium">Usuario</th>
                <th class="pb-3.5 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              @for (a of data?.recentActivity; track a.id) {
                <tr class="border-b border-border/50 hover:bg-accent transition-colors">
                  <td class="py-3.5 pr-6 text-foreground font-medium">{{ a.productName }}</td>
                  <td class="py-3.5 pr-6">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium"
                          [class]="a.type === 'INCOMING' ? 'bg-emerald-50 text-emerald-700' : a.type === 'OUTGOING' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'">
                      {{ a.type === 'INCOMING' ? 'Entrada' : a.type === 'OUTGOING' ? 'Salida' : 'Ajuste' }}
                    </span>
                  </td>
                  <td class="py-3.5 pr-6 text-foreground font-semibold">{{ a.quantity }}</td>
                  <td class="py-3.5 pr-6 text-muted-foreground">{{ a.userName }}</td>
                  <td class="py-3.5 text-muted-foreground/60 text-xs">{{ a.date | date:'dd/MM/yyyy HH:mm' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class Dashboard implements OnInit {
  data?: DashboardData;
  maxCategoryCount = 1;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getDashboard().subscribe(d => {
      this.data = d;
      this.maxCategoryCount = Math.max(...d.productsByCategory.map(c => c.count));
    });
  }

  getMaxMovement(): number {
    if (!this.data?.movementsByMonth?.length) return 1;
    return Math.max(...this.data.movementsByMonth.flatMap(m => [m.incoming, m.outgoing]), 1);
  }
}
