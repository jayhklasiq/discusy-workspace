import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5000/posts'; // Update with your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Public route - no auth needed
  getAllPosts(): Observable<Post[]> {
    try {
      return this.http.get<Post[]>(this.apiUrl, {
        headers: this.getHeaders()
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          console.error('Error fetching posts:', error);
          return throwError(() => new Error('Failed to fetch posts'));
        })
      );
    } catch (error) {
      console.error('Authentication error:', error);
      this.router.navigate(['/login']);
      return throwError(() => new Error('Authentication required'));
    }
  }

  // Protected route - needs auth
  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Protected route - needs auth
  createPost(data: { title: string; content: string }): Observable<Post> {
    try {
      return this.http.post<Post>(`${this.apiUrl}/create`, data, {
        headers: this.getHeaders()
      });
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  // Protected route - needs auth
  updatePost(id: string, data: { title: string; content: string }): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders()
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.error('Post not found:', error);
          return throwError(() => new Error('Post not found'));
        }
        if (error.status === 401) {
          this.router.navigate(['/login']);
          return throwError(() => new Error('Authentication required'));
        }
        return throwError(() => new Error('Failed to update post'));
      })
    );
  }

  // Protected route - needs auth
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, {
      headers: this.getHeaders()
    });
  }
}
