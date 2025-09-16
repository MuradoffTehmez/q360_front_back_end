// AuthService.ts
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

export class AuthService {
  static async login(email: string, password: string): Promise<{user: User, access: string, refresh: string} | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if MFA is required
        if (data.mfa_required) {
          // Return MFA required indicator
          return { mfaRequired: true, userId: data.user_id } as any;
        }
        
        const user = data.user;
        // Save tokens and user to localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return {user, access: data.access, refresh: data.refresh};
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async register(userData: any): Promise<{user: User, access: string, refresh: string} | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        // Save tokens and user to localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return {user, access: data.access, refresh: data.refresh};
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
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
      const response = await fetch(`${API_BASE_URL}/password-reset/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Password reset request failed');
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  static async passwordResetConfirm(token: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          new_password: newPassword,
          new_password_confirm: newPassword
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset confirm error:', error);
      throw error;
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  static async setupMFA(): Promise<{secret: string, backupCodes: string[], qrCodeUrl: string}> {
    try {
      const response = await fetch(`${API_BASE_URL}/mfa/setup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'MFA setup failed');
      }
    } catch (error) {
      console.error('MFA setup error:', error);
      throw error;
    }
  }

  static async enableMFA(token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/mfa/enable/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'MFA enable failed');
      }
    } catch (error) {
      console.error('MFA enable error:', error);
      throw error;
    }
  }

  static async disableMFA(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/mfa/disable/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAccessToken()}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'MFA disable failed');
      }
    } catch (error) {
      console.error('MFA disable error:', error);
      throw error;
    }
  }

  static async verifyMFA(userId: number, token: string, backupCode?: string): Promise<{user: User, access: string, refresh: string}> {
    try {
      const response = await fetch(`${API_BASE_URL}/mfa/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, token, backup_code: backupCode }),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        // Save tokens and user to localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return {user, access: data.access, refresh: data.refresh};
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'MFA verification failed');
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      throw error;
    }
  }
}