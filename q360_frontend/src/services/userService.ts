// userService.ts
import axios from 'axios';
import { User } from './AuthService';

const API_BASE_URL = 'http://localhost:8000/api/auth';

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

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  hire_date?: string;
  timezone?: string;
  language?: string;
  bio?: string;
}

export class UserService {
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/me/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch user data');
    }
  }

  static async updateUser(userData: UpdateUserData): Promise<User> {
    try {
      const response = await apiClient.patch('/me/', userData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to update user data');
    }
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/change-password/', {
        old_password: oldPassword,
        new_password: newPassword
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to change password');
    }
  }
}