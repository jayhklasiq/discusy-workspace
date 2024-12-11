import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedInSubject.next(!!this.getToken());
    }
  }

  loginUser(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }

  registerUser(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { 
      name, 
      email, 
      password 
    });
  }

refreshToken(): void {
  const refreshToken = this.getRefreshToken();
  if (!refreshToken) {
    this.logout();
    return;
  }
  this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).subscribe({
    next: (response) => {
      this.storeTokens(response);
    },
    error: (err) => {
      console.error('Token refresh failed:', err);
      this.logout();
    }
  });
}


  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      this.isLoggedInSubject.next(false);
    }
  }

 getToken(): string | null {
  if (isPlatformBrowser(this.platformId)) {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    if (!token) {
      console.error('No token found in localStorage.');
    }
    return token;
  }
  return null;
}


  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  storeTokens(tokens: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      if (tokens.accessToken) {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      }
      if (tokens.refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      this.isLoggedInSubject.next(true);
    }
  }

  clearTokens(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      this.isLoggedInSubject.next(false);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
}