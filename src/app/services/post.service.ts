import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5000/posts'; // Update with your API URL

  constructor(
    private http: HttpClient,
    private authService: AuthService
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
    return this.http.get<Post[]>(this.apiUrl);
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
    return this.http.put<Post>(`${this.apiUrl}/update/${id}`, data, {
      headers: this.getHeaders()
    });
  }

  // Protected route - needs auth
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, {
      headers: this.getHeaders()
    });
  }
}
