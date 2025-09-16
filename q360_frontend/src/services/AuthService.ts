// AuthService.ts
import axios from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  email_verified: boolean;
  mfa_enabled: boolean;
}

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

// Add interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        AuthService.logout();
      }
    }
    
    return Promise.reject(error);
  }
);

export class AuthService {
  static async login(email: string, password: string): Promise<{user: User, access: string, refresh: string} | null> {
    try {
      const response = await apiClient.post('/login/', { 
        username: email, 
        password 
      });

      if (response.data.mfa_required) {
        // Return MFA required indicator
        return { 
          mfaRequired: true, 
          userId: response.data.user_id 
        } as any;
      }
      
      const { user, access, refresh } = response.data;
      
      // Save tokens and user to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { user, access, refresh };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Login failed');
    }
  }

  static async register(userData: any): Promise<{user: User, access: string, refresh: string} | null> {
    try {
      const response = await apiClient.post('/register/', userData);
      
      const { user, access, refresh } = response.data;
      
      // Save tokens and user to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { user, access, refresh };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Registration failed');
    }
  }

  static async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await apiClient.post('/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('currentUser');
    }
  }

  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  static getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  static async passwordResetRequest(email: string): Promise<void> {
    try {
      await apiClient.post('/password-reset/request/', { email });
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Password reset request failed');
    }
  }

  static async passwordResetConfirm(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/password-reset/confirm/', { 
        token, 
        new_password: newPassword,
        new_password_confirm: newPassword
      });
    } catch (error: any) {
      console.error('Password reset confirm error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Password reset failed');
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.post('/verify-email/', { token });
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Email verification failed');
    }
  }

  static async setupMFA(): Promise<{secret: string, backupCodes: string[], qrCodeUrl: string}> {
    try {
      const response = await apiClient.post('/mfa/setup/');
      return response.data;
    } catch (error: any) {
      console.error('MFA setup error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'MFA setup failed');
    }
  }

  static async enableMFA(token: string): Promise<void> {
    try {
      await apiClient.post('/mfa/enable/', { token });
    } catch (error: any) {
      console.error('MFA enable error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'MFA enable failed');
    }
  }

  static async disableMFA(): Promise<void> {
    try {
      await apiClient.post('/mfa/disable/');
    } catch (error: any) {
      console.error('MFA disable error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'MFA disable failed');
    }
  }

  static async verifyMFA(userId: number, token: string, backupCode?: string): Promise<{user: User, access: string, refresh: string}> {
    try {
      const response = await apiClient.post('/mfa/verify/', { 
        user_id: userId, 
        token, 
        backup_code: backupCode 
      });
      
      const { user, access, refresh } = response.data;
      
      // Save tokens and user to localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { user, access, refresh };
    } catch (error: any) {
      console.error('MFA verification error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'MFA verification failed');
    }
  }

  // New method to fetch current user data from backend
  static async fetchCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get('/me/');
      const user = response.data;
      
      // Update user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Fetch current user error:', error);
      return null;
    }
  }
}