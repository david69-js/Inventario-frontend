import { Component, OnInit } from '@angular/core';
import { ReportService, LowStockItem, InventoryValueReport } from '../../core/services/report.service';
import { DashboardData } from '../../core/models/dashboard.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-lg font-semibold text-foreground">Reportes</h1>
        <p class="text-sm text-muted-foreground mt-1">Analíticas y alertas del inventario</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 class="text-sm font-semibold text-foreground mb-5">Movimientos Mensuales</h3>
          <div class="flex items-end gap-2 h-44">
            @for (m of monthlyMovements; track m.month) {
              <div class="flex-1 flex flex-col items-center gap-1.5">
                <div class="w-full flex gap-0.5 rounded-sm overflow-hidden" style="height: 140px;">
                  <div class="flex-1 bg-foreground rounded-sm transition-all duration-300"
                       [style.height.%]="(m.incoming / maxIncoming) * 100"></div>
                  <div class="flex-1 bg-muted-foreground rounded-sm transition-all duration-300"
                       [style.height.%]="(m.outgoing / maxOutgoing) * 100"></div>
                </div>
                <span class="text-[11px] text-muted-foreground font-medium">{{ m.month }}</span>
              </div>
            }
          </div>
          <div class="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-foreground rounded-sm"></span> Entradas</span>
            <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-muted-foreground rounded-sm"></span> Salidas</span>
          </div>
        </div>

        <div class="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 class="text-sm font-semibold text-foreground mb-5">Valor del Inventario por Categoría</h3>
          <div class="space-y-4">
            @for (c of inventoryValue?.byCategory; track c.category) {
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm text-muted-foreground truncate">{{ c.category }}</span>
                  <span class="text-sm font-medium text-foreground">{{ c.value | currency }}</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div class="h-full bg-foreground rounded-full transition-all duration-300"
                       [style.width.%]="(c.value / maxValue) * 100"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4">Alertas de Stock Bajo</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs text-muted-foreground border-b border-border">
                <th class="pb-3.5 pr-6 font-medium">Producto</th>
                <th class="pb-3.5 pr-6 font-medium">SKU</th>
                <th class="pb-3.5 pr-6 font-medium">Categoría</th>
                <th class="pb-3.5 pr-6 font-medium">Stock Actual</th>
                <th class="pb-3.5 pr-6 font-medium">Stock Mínimo</th>
                <th class="pb-3.5 pr-6 font-medium">Déficit</th>
                <th class="pb-3.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (p of lowStockItems; track p.id) {
                <tr class="border-b border-border/50 hover:bg-accent transition-colors">
                  <td class="py-3.5 pr-6 font-medium text-foreground">{{ p.name }}</td>
                  <td class="py-3.5 pr-6 text-muted-foreground font-mono text-xs">{{ p.sku }}</td>
                  <td class="py-3.5 pr-6 text-muted-foreground text-xs">{{ p.category || '—' }}</td>
                  <td class="py-3.5 pr-6 text-amber-600 font-medium">{{ p.stock }}</td>
                  <td class="py-3.5 pr-6 text-muted-foreground">{{ p.minStock }}</td>
                  <td class="py-3.5 pr-6 text-destructive font-medium">-{{ p.deficit }}</td>
                  <td class="py-3.5">
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700">Stock Bajo</span>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="7" class="py-8 text-center text-muted-foreground text-sm">Sin alertas de stock bajo</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-card rounded-xl border border-border shadow-sm p-5">
        <h3 class="text-sm font-semibold text-foreground mb-4">Resumen General</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-5 bg-muted rounded-lg border border-border">
            <p class="text-2xl font-bold text-foreground">{{ data?.totalProducts }}</p>
            <p class="text-xs text-muted-foreground mt-1">Total Productos</p>
          </div>
          <div class="text-center p-5 bg-muted rounded-lg border border-border">
            <p class="text-2xl font-bold text-amber-600">{{ lowStockItems.length }}</p>
            <p class="text-xs text-muted-foreground mt-1">Stock Bajo</p>
          </div>
          <div class="text-center p-5 bg-muted rounded-lg border border-border">
            <p class="text-2xl font-bold text-foreground">{{ inventoryValue?.totalValue | currency }}</p>
            <p class="text-xs text-muted-foreground mt-1">Valor Total</p>
          </div>
          <div class="text-center p-5 bg-muted rounded-lg border border-border">
            <p class="text-2xl font-bold text-foreground">{{ data?.monthlyMovements }}</p>
            <p class="text-xs text-muted-foreground mt-1">Mov. del Mes</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Reports implements OnInit {
  data?: DashboardData;
  lowStockItems: LowStockItem[] = [];
  monthlyMovements: { month: string; incoming: number; outgoing: number }[] = [];
  inventoryValue?: InventoryValueReport;
  maxIncoming = 1;
  maxOutgoing = 1;
  maxValue = 1;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getDashboard().subscribe(d => {
      this.data = d;
    });
    this.reportService.getLowStock().subscribe(items => {
      this.lowStockItems = items;
    });
    this.reportService.getMonthlyMovements().subscribe(movements => {
      this.monthlyMovements = movements;
      this.maxIncoming = Math.max(1, ...movements.map(m => m.incoming));
      this.maxOutgoing = Math.max(1, ...movements.map(m => m.outgoing));
    });
    this.reportService.getInventoryValue().subscribe(report => {
      this.inventoryValue = report;
      this.maxValue = Math.max(1, ...report.byCategory.map(c => c.value));
    });
  }
}
