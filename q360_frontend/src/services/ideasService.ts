// ideasService.ts
import axios from 'axios';
import { User } from './AuthService';

const API_BASE_URL = 'http://localhost:8000/api/ideas';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface IdeaCategory {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface IdeaComment {
  id: number;
  idea: number;
  author: User;
  content: string;
  parent: number | null;
  replies: IdeaComment[];
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  category: IdeaCategory | null;
  department: any;
  submitter: User;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'implemented' | 'rejected';
  implementation_date: string | null;
  likes_count: number;
  views_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  likes: any[];
  comments: IdeaComment[];
}

export interface NewIdea {
  title: string;
  description: string;
  category?: number;
  department?: number;
}

export class IdeasService {
  static async getIdeas(): Promise<Idea[]> {
    try {
      const response = await apiClient.get('/ideas/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching ideas:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch ideas');
    }
  }

  static async getIdea(id: number): Promise<Idea> {
    try {
      const response = await apiClient.get(`/ideas/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching idea:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch idea');
    }
  }

  static async createIdea(ideaData: NewIdea): Promise<Idea> {
    try {
      const response = await apiClient.post('/ideas/', ideaData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating idea:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to create idea');
    }
  }

  static async upvoteIdea(id: number): Promise<{message: string, likes_count: number}> {
    try {
      const response = await apiClient.post(`/ideas/${id}/upvote/`);
      return response.data;
    } catch (error: any) {
      console.error('Error upvoting idea:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to upvote idea');
    }
  }

  static async downvoteIdea(id: number): Promise<{message: string, likes_count: number}> {
    try {
      const response = await apiClient.post(`/ideas/${id}/downvote/`);
      return response.data;
    } catch (error: any) {
      console.error('Error downvoting idea:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to downvote idea');
    }
  }

  static async getIdeaComments(ideaId: number): Promise<IdeaComment[]> {
    try {
      const response = await apiClient.get(`/ideas/${ideaId}/comments/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching idea comments:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch idea comments');
    }
  }

  static async addComment(ideaId: number, content: string, parentId?: number): Promise<IdeaComment> {
    try {
      const response = await apiClient.post(`/ideas/${ideaId}/add_comment/`, {
        content,
        parent_id: parentId
      });
      return response.data;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to add comment');
    }
  }
}