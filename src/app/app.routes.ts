import { Routes } from '@angular/router';
import { DiscussionFeedComponent } from './components/discussion-feed/discussion-feed.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { CreatePostComponent } from './components/discussion-feed/create-post/create-post.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'discussion', component: DiscussionFeedComponent, children: [
    { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard] }
  ]}
];
