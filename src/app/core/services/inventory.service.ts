import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { InventoryMovement, MovementType } from '../models/inventory-movement.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private api = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  private mapMovement(m: any): InventoryMovement {
    return {
      id: m.id,
      productId: m.productId,
      productName: m.product?.name,
      type: m.type,
      quantity: Math.abs(m.quantity),
      description: m.description,
      userId: m.userId,
      userName: m.user?.name,
      createdAt: m.createdAt,
    };
  }

  getAll(): Observable<InventoryMovement[]> {
    return this.http.get<{ items: any[] }>(this.api).pipe(
      map(res => res.items.map(this.mapMovement)),
    );
  }

  getByProduct(productId: string): Observable<InventoryMovement[]> {
    return this.http.get<any[]>(`${this.api}/product/${productId}`).pipe(
      map(items => items.map(this.mapMovement)),
    );
  }

  register(type: MovementType, productId: string, quantity: number, description?: string, userId?: string): Observable<InventoryMovement> {
    const endpoint = type === MovementType.INCOMING ? 'incoming'
      : type === MovementType.OUTGOING ? 'outgoing'
      : 'adjust';
    const body: any = { productId, quantity, description, userId };
    return this.http.post<any>(`${this.api}/${endpoint}`, body).pipe(map(this.mapMovement));
  }
}
