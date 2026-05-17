import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import { DashboardData } from '../../core/models/dashboard.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, MatCardModule, MatTableModule, MatIconModule, MatChipsModule],
  template: `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Resumen general del inventario</p>
    </div>

    <div class="stats-grid">
      <mat-card class="stat-card-wrapper">
        <mat-card-content class="stat-card">
          <div class="stat-icon-wrap">
            <mat-icon>inventory_2</mat-icon>
          </div>
          <div class="stat-label">Total Productos</div>
          <div class="stat-value">{{ data?.totalProducts }}</div>
          <div class="stat-desc">Productos registrados</div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stat-card-wrapper">
        <mat-card-content class="stat-card">
          <div class="stat-icon-wrap warn">
            <mat-icon>warning_amber</mat-icon>
          </div>
          <div class="stat-label">Stock Bajo</div>
          <div class="stat-value error-text">{{ data?.lowStockProducts }}</div>
          <div class="stat-desc">Requieren reposición</div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stat-card-wrapper">
        <mat-card-content class="stat-card">
          <div class="stat-icon-wrap success">
            <mat-icon>account_balance_wallet</mat-icon>
          </div>
          <div class="stat-label">Valor Inventario</div>
          <div class="stat-value">{{ data?.inventoryValue | currency }}</div>
          <div class="stat-desc">Valor total en stock</div>
        </mat-card-content>
      </mat-card>

      <mat-card class="stat-card-wrapper">
        <mat-card-content class="stat-card">
          <div class="stat-icon-wrap">
            <mat-icon>swap_vert</mat-icon>
          </div>
          <div class="stat-label">Mov. del Mes</div>
          <div class="stat-value">{{ data?.monthlyMovements }}</div>
          <div class="stat-desc">Movimientos registrados</div>
        </mat-card-content>
      </mat-card>
    </div>

    <div class="charts-grid">
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Movimientos Mensuales</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="bar-chart">
            @for (m of data?.movementsByMonth || []; track m.month) {
              <div class="bar-group">
                <div class="bar bars">
                  <div class="bar-incoming" [style.height.%]="(m.incoming / getMaxMovement()) * 100"></div>
                  <div class="bar-outgoing" [style.height.%]="(m.outgoing / getMaxMovement()) * 100"></div>
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
        <mat-card-header>
          <mat-card-title>Productos por Categoría</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="category-list">
            @for (c of data?.productsByCategory || []; track c.category) {
              <div class="category-row">
              <div class="category-info">
                <span class="category-name">{{ c.category }}</span>
                <span class="category-count">{{ c.count }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="(c.count / maxCategoryCount) * 100"></div>
              </div>
            </div>
          }
        </div>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card>
      <mat-card-header>
        <mat-card-title>Actividad Reciente</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="data?.recentActivity || []" class="full-width">
          <ng-container matColumnDef="product">
            <th mat-header-cell *matHeaderCellDef>Producto</th>
            <td mat-cell *matCellDef="let a">{{ a.productName }}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Tipo</th>
            <td mat-cell *matCellDef="let a">
              <span class="badge" [class]="a.type === 'INCOMING' ? 'badge-success' : a.type === 'OUTGOING' ? 'badge-error' : 'badge-warning'">
                {{ a.type === 'INCOMING' ? 'Entrada' : a.type === 'OUTGOING' ? 'Salida' : 'Ajuste' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="quantity">
            <th mat-header-cell *matHeaderCellDef>Cantidad</th>
            <td mat-cell *matCellDef="let a"><strong>{{ a.quantity }}</strong></td>
          </ng-container>
          <ng-container matColumnDef="user">
            <th mat-header-cell *matHeaderCellDef>Usuario</th>
            <td mat-cell *matCellDef="let a">{{ a.userName }}</td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef>Fecha</th>
            <td mat-cell *matCellDef="let a">{{ a.date | date:'dd/MM/yyyy HH:mm' }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="activityColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: activityColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
      animation: slideUp 0.3s ease 0.05s both;
    }

    .stat-card-wrapper {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .stat-card-wrapper:hover {
      transform: translateY(-2px);
    }

    .stat-icon-wrap {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-hover);
      margin-bottom: 12px;
    }
    .stat-icon-wrap .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--text-muted) !important;
    }
    .stat-icon-wrap.warn { background: var(--error-bg); }
    .stat-icon-wrap.warn .mat-icon { color: var(--error) !important; }
    .stat-icon-wrap.success { background: var(--success-bg); }
    .stat-icon-wrap.success .mat-icon { color: var(--success) !important; }

    .error-text { color: var(--error) !important; }

    .charts-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
      animation: slideUp 0.3s ease 0.1s both;
    }

    mat-card { margin-bottom: 24px; }
    mat-card:last-child { margin-bottom: 0; }

    mat-card-title {
      font-size: 14px !important;
      font-weight: 600 !important;
      color: #171717 !important;
      letter-spacing: -0.01em !important;
    }

    .bar-chart {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 160px;
      padding-top: 20px;
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .bars {
      width: 100%;
      display: flex;
      gap: 3px;
      height: 140px;
      align-items: flex-end;
    }

    .bar-incoming {
      flex: 1;
      background: var(--accent);
      border-radius: 3px 3px 0 0;
      transition: height 0.4s ease;
      min-height: 2px;
    }

    .bar-outgoing {
      flex: 1;
      background: var(--bg-active);
      border-radius: 3px 3px 0 0;
      transition: height 0.4s ease;
      min-height: 2px;
    }

    .bar-label {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .bar-legend {
      display: flex;
      gap: 16px;
      margin-top: 14px;
      font-size: 12px;
      color: var(--text-secondary);
    }

    .legend-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 3px;
      margin-right: 6px;
      vertical-align: middle;
    }
    .legend-dot.incoming { background: var(--accent); }
    .legend-dot.outgoing { background: var(--bg-active); }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .category-name {
      font-size: 13px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .category-count {
      font-weight: 600;
      font-size: 13px;
      color: var(--text-primary);
    }

    .progress-bar {
      height: 6px;
      background: var(--bg-hover);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    /* Vercel-style badges */
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid;
    }
    .badge-success {
      background: var(--success-bg);
      color: var(--success);
      border-color: var(--success-border);
    }
    .badge-error {
      background: var(--error-bg);
      color: var(--error);
      border-color: var(--error-border);
    }
    .badge-warning {
      background: var(--warning-bg);
      color: var(--warning);
      border-color: var(--warning-border);
    }
  `]
})
export class Dashboard implements OnInit {
  data?: DashboardData;
  maxCategoryCount = 1;
  activityColumns = ['product', 'type', 'quantity', 'user', 'date'];

  constructor(private reportService: ReportService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.reportService.getDashboard().subscribe(d => {
      this.data = d;
      this.maxCategoryCount = Math.max(...d.productsByCategory.map(c => c.count), 1);
      this.cdr.detectChanges();
    });
  }

  getMaxMovement(): number {
    if (!this.data?.movementsByMonth?.length) return 1;
    return Math.max(...this.data.movementsByMonth.flatMap(m => [m.incoming, m.outgoing]), 1);
  }
}
