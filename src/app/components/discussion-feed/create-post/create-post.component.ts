import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  templateUrl: './create-post.component.html',
  styleUrls: [],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CreatePostComponent {
  postForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private postService: PostService, 
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.postForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;
      
      console.log('Submitting post:', this.postForm.value); // Debug log
      
      this.postService.createPost(this.postForm.value).subscribe({
        next: (response) => {
          console.log('Post created:', response); // Debug log
          this.router.navigate(['/discussion']).then(() => {
            window.location.reload(); // Refresh the document list
          });
        },
        error: (error) => {
          console.error('Error creating post:', error); // Debug log
          this.error = error.error?.message || 'Failed to create post. Please try again.';
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}