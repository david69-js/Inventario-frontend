import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.api);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.api}/unread-count`);
  }

  markAsRead(id: string): Observable<boolean> {
    return this.http.patch<AppNotification>(`${this.api}/${id}/read`, {}).pipe(map(() => true));
  }

  markAllAsRead(): Observable<boolean> {
    return this.http.patch<{ count: number }>(`${this.api}/read-all`, {}).pipe(map(() => true));
  }
}
