import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardData } from '../models/dashboard.model';

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  deficit: number;
  category: string;
}

export interface ProductAnalytics {
  id: string;
  name: string;
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  status: string;
  category: string;
  supplier: string;
  totalIncoming: number;
  totalOutgoing: number;
  turnoverRate: number;
}

export interface InventoryValueReport {
  totalValue: number;
  totalProducts: number;
  averagePrice: number;
  byCategory: { category: string; value: number }[];
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<any>(`${this.api}/dashboard`).pipe(
      map(res => ({
        totalProducts: res.totalProducts ?? 0,
        lowStockProducts: res.lowStockProducts ?? 0,
        inventoryValue: Number(res.inventoryValue ?? 0),
        monthlyMovements: res.monthlyMovements ?? 0,
        movementsByMonth: res.monthlyMovements ?? [],
        productsByCategory: (res.productsByCategory || []).map((c: any) => ({
          category: c.categoryId || '',
          count: c._count || 0,
        })),
        inventoryValueOverTime: [],
        recentActivity: (res.recentActivity || []).map((a: any) => ({
          id: a.id,
          productName: a.product?.name || '',
          type: a.type,
          quantity: Math.abs(a.quantity),
          userName: a.user?.name || '',
          date: a.createdAt,
        })),
      })),
    );
  }

  getMonthlyMovements(): Observable<{ month: string; incoming: number; outgoing: number }[]> {
    return this.http.get<any[]>(`${this.api}/monthly-movements`);
  }

  getLowStock(): Observable<LowStockItem[]> {
    return this.http.get<LowStockItem[]>(`${this.api}/low-stock`);
  }

  getProductAnalytics(): Observable<ProductAnalytics[]> {
    return this.http.get<ProductAnalytics[]>(`${this.api}/product-analytics`);
  }

  getInventoryValue(): Observable<InventoryValueReport> {
    return this.http.get<InventoryValueReport>(`${this.api}/inventory-value`);
  }
}
