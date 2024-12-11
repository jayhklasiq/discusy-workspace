import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { CreatePostComponent } from "./create-post/create-post.component";

@Component({
  selector: 'app-discussion-feed',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './discussion-feed.component.html',
  styleUrl: './discussion-feed.component.css'
})
export class DiscussionFeedComponent implements OnInit {
  posts: Post[] = [];
  postToDelete: string | null = null;
  deleteError: string | null = null;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => console.error('Error loading posts:', error)
    });
  }

confirmDelete(postId: string) {
  if (this.postToDelete === postId) {
    this.postToDelete = null;
  } else {
    this.postToDelete = postId;
  }
}

  cancelDelete() {
    this.postToDelete = null;
    this.deleteError = null;
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        this.posts = this.posts.filter(post => post._id !== postId);
        this.postToDelete = null;
        this.deleteError = null;
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        this.deleteError = 'Failed to delete post. Please try again.';
      }
    });
  }
}
