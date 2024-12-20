import { User } from './user.model';

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  timestamp?: Date;
}