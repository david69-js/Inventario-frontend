import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

interface LoginResponse {
  accessToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'inventario_token';
  private userKey = 'inventario_user';

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem(this.userKey);
    if (saved) {
      this.currentUserSubject.next(JSON.parse(saved));
    }
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUser;
    return user ? roles.includes(user.role) : false;
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, { email, password }).pipe(
      map(res => {
        localStorage.setItem(this.tokenKey, res.accessToken);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
        return res.user;
      }),
    );
  }

  logout(): void {
    this.http.post(`${this.api}/auth/logout`, {}).subscribe({
      error: () => {},
    });
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.api}/auth/change-pwd`, { currentPassword, newPassword });
  }

  updateProfile(userId: string, data: { name: string; email: string }): Observable<User> {
    return this.http.patch<User>(`${this.api}/users/${userId}`, data).pipe(
      tap(user => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          const updated = { ...currentUser, ...user };
          localStorage.setItem(this.userKey, JSON.stringify(updated));
          this.currentUserSubject.next(updated);
        }
      }),
    );
  }
}
