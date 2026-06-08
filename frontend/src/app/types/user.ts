export interface User {
  _id: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  recentPosts: number
  avatarUrl: string;
  role: string;
}

export interface Channel {
  _id: string;
  name: string;
  isOpen: string;
  description: string;
}