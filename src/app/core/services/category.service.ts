import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.api);
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.api}/${id}`);
  }

  create(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.api, data);
  }

  update(id: string, changes: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.api}/${id}`, changes);
  }

  delete(id: string): Observable<boolean> {
    return this.http.delete<{ deleted: boolean }>(`${this.api}/${id}`).pipe(map(() => true));
  }
}
