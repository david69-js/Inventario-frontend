import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supplier } from '../models/supplier.model';

@Injectable({ providedIn: 'root' })
export class SupplierService {
  private api = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.api);
  }

  getById(id: string): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.api}/${id}`);
  }

  create(data: Partial<Supplier>): Observable<Supplier> {
    return this.http.post<Supplier>(this.api, data);
  }

  update(id: string, changes: Partial<Supplier>): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.api}/${id}`, changes);
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<{ deleted: boolean }>(`${this.api}/${id}`).pipe(map(() => true));
  }
}
