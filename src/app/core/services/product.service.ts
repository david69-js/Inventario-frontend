import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  private mapProduct(p: any): Product {
    return {
      ...p,
      price: Number(p.price),
      categoryName: p.category?.name,
      supplierName: p.supplier?.name,
    };
  }

  getAll(query?: { search?: string; categoryId?: string; status?: string }): Observable<Product[]> {
    return this.http.get<PaginatedResponse<any>>(this.api, { params: query as any }).pipe(
      map(res => res.items.map(this.mapProduct)),
    );
  }

  getById(id: string): Observable<Product> {
    return this.http.get<any>(`${this.api}/${id}`).pipe(map(this.mapProduct));
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<any>(this.api, product).pipe(map(this.mapProduct));
  }

  update(id: string, changes: Partial<Product>): Observable<Product> {
    return this.http.patch<any>(`${this.api}/${id}`, changes).pipe(map(this.mapProduct));
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<{ deleted: boolean }>(`${this.api}/${id}`).pipe(map(() => true));
  }

  getLowStock(): Observable<Product[]> {
    return this.http.get<any[]>(`${this.api}/low-stock`).pipe(
      map(products => products.map(this.mapProduct)),
    );
  }
}
