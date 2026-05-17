import { Component, OnInit } from '@angular/core';
import { ReportService, LowStockItem, InventoryValueReport } from '../../core/services/report.service';
import { DashboardData } from '../../core/models/dashboard.model';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CurrencyPipe, MatCardModule, MatTableModule, MatChipsModule],
  template: `
    <div class="page-header">
      <h1>Reportes</h1>
      <p>Analíticas y alertas del inventario</p>
    </div>

    <div class="charts-grid">
      <mat-card>
        <mat-card-header><mat-card-title>Movimientos Mensuales</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="bar-chart">
            @for (m of monthlyMovements; track m.month) {
              <div class="bar-group">
                <div class="bars">
                  <div class="bar-incoming" [style.height.%]="(m.incoming / maxIncoming) * 100"></div>
                  <div class="bar-outgoing" [style.height.%]="(m.outgoing / maxOutgoing) * 100"></div>
                </div>
                <span class="bar-label">{{ m.month }}</span>
              </div>
            }
          </div>
          <div class="bar-legend">
            <span><span class="legend-dot incoming"></span> Entradas</span>
            <span><span class="legend-dot outgoing"></span> Salidas</span>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header><mat-card-title>Valor del Inventario por Categoría</mat-card-title></mat-card-header>
        <mat-card-content>
          <div class="category-value-list">
            @for (c of inventoryValue?.byCategory; track c.category) {
              <div class="category-value-row">
                <div class="cv-info"><span>{{ c.category }}</span><span class="cv-value">{{ c.value | currency }}</span></div>
                <div class="cv-bar"><div class="cv-fill" [style.width.%]="(c.value / maxValue) * 100"></div></div>
              </div>
            }
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card>
      <mat-card-header><mat-card-title>Alertas de Stock Bajo</mat-card-title></mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="lowStockItems">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Producto</th>
            <td mat-cell *matCellDef="let p">{{ p.name }}</td>
          </ng-container>
          <ng-container matColumnDef="sku">
            <th mat-header-cell *matHeaderCellDef>SKU</th>
            <td mat-cell *matCellDef="let p"><code>{{ p.sku }}</code></td>
          </ng-container>
          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Categoría</th>
            <td mat-cell *matCellDef="let p">{{ p.category || '—' }}</td>
          </ng-container>
          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef>Stock Actual</th>
            <td mat-cell *matCellDef="let p" class="warn-text">{{ p.stock }}</td>
          </ng-container>
          <ng-container matColumnDef="minStock">
            <th mat-header-cell *matHeaderCellDef>Stock Mínimo</th>
            <td mat-cell *matCellDef="let p">{{ p.minStock }}</td>
          </ng-container>
          <ng-container matColumnDef="deficit">
            <th mat-header-cell *matHeaderCellDef>Déficit</th>
            <td mat-cell *matCellDef="let p" style="color: var(--mat-sys-error); font-weight: 500;">-{{ p.deficit }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let p"><mat-chip color="warn" highlighted>Stock Bajo</mat-chip></td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="lowStockColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: lowStockColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-header><mat-card-title>Resumen General</mat-card-title></mat-card-header>
      <mat-card-content>
        <div class="summary-grid">
          <div class="summary-item"><span class="summary-value">{{ data?.totalProducts }}</span><span class="summary-label">Total Productos</span></div>
          <div class="summary-item"><span class="summary-value" style="color: var(--mat-sys-error)">{{ lowStockItems.length }}</span><span class="summary-label">Stock Bajo</span></div>
          <div class="summary-item"><span class="summary-value">{{ inventoryValue?.totalValue | currency }}</span><span class="summary-label">Valor Total</span></div>
          <div class="summary-item"><span class="summary-value">{{ data?.monthlyMovements }}</span><span class="summary-label">Mov. del Mes</span></div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    mat-card { margin-bottom: 20px; }
    mat-card:last-child { margin-bottom: 0; }
    .bar-chart { display: flex; align-items: flex-end; gap: 4px; height: 160px; padding-top: 20px; }
    .bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .bars { width: 100%; display: flex; gap: 2px; height: 140px; align-items: flex-end; }
    .bar-incoming { flex: 1; background: var(--mat-sys-primary); border-radius: 2px 2px 0 0; transition: height 0.3s; min-height: 2px; }
    .bar-outgoing { flex: 1; background: var(--mat-sys-primary-container); border-radius: 2px 2px 0 0; transition: height 0.3s; min-height: 2px; }
    .bar-label { font-size: 11px; color: var(--mat-sys-on-surface-variant); }
    .bar-legend { display: flex; gap: 16px; margin-top: 12px; font-size: 12px; color: var(--mat-sys-on-surface-variant); }
    .legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: middle; }
    .legend-dot.incoming { background: var(--mat-sys-primary); }
    .legend-dot.outgoing { background: var(--mat-sys-primary-container); }
    .category-value-list { display: flex; flex-direction: column; gap: 16px; }
    .category-value-row { }
    .cv-info { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
    .cv-value { font-weight: 500; }
    .cv-bar { height: 8px; background: var(--mat-sys-surface-container-high); border-radius: 4px; overflow: hidden; }
    .cv-fill { height: 100%; background: var(--mat-sys-primary); border-radius: 4px; transition: width 0.4s; }
    .warn-text { color: #f59e0b; font-weight: 500; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .summary-item { text-align: center; padding: 20px; background: var(--mat-sys-surface-container); border-radius: 8px; }
    .summary-value { display: block; font-size: 28px; font-weight: 500; color: var(--mat-sys-on-surface); }
    .summary-label { font-size: 12px; color: var(--mat-sys-on-surface-variant); margin-top: 4px; display: block; }
    code { font-family: 'Roboto Mono', monospace; font-size: 12px; }
  `]
})
export class Reports implements OnInit {
  data?: DashboardData;
  lowStockItems: LowStockItem[] = [];
  monthlyMovements: { month: string; incoming: number; outgoing: number }[] = [];
  inventoryValue?: InventoryValueReport;
  maxIncoming = 1;
  maxOutgoing = 1;
  maxValue = 1;
  lowStockColumns = ['name', 'sku', 'category', 'stock', 'minStock', 'deficit', 'status'];

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getDashboard().subscribe(d => this.data = d);
    this.reportService.getLowStock().subscribe(items => this.lowStockItems = items);
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
