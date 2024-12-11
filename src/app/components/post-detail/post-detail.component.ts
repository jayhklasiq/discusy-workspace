import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: []
})
export class PostDetailComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  postId: string = '';
  isLoading = false;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postId = id;
      this.loadPost();
    } else {
      this.router.navigate(['/discussion']);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadPost() {
    this.isLoading = true;
    this.error = null;
    
    this.subscription.add(
      this.postService.getPostById(this.postId).subscribe({
        next: (post: Post) => {
          this.postForm.patchValue({
            title: post.title,
            content: post.content
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading post:', err);
          this.error = 'Failed to load post. Please try again.';
          this.isLoading = false;
        }
      })
    );
  }

  onSubmit() {
    if (this.postForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;

      this.subscription.add(
        this.postService.updatePost(this.postId, this.postForm.value).subscribe({
          next: () => {
            this.router.navigate(['/discussion']);
          },
          error: (err) => {
            console.error('Error updating post:', err);
            this.error = 'Failed to update post. Please try again.';
            this.isLoading = false;
          }
        })
      );
    }
  }
}