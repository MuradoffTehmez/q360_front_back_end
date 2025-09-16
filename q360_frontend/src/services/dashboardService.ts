// dashboardService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/reports';

export interface DashboardData {
  // Admin dashboard data
  total_users?: number;
  total_ideas?: number;
  total_evaluations?: number;
  pending_evaluations?: number;
  
  // Manager dashboard data
  team_members?: number;
  team_evaluations?: number;
  pending_team_evaluations?: number;
  team_performance?: number;
  
  // Employee dashboard data
  my_evaluations?: number;
  pending_my_evaluations?: number;
  my_ideas?: number;
  performance_score?: number;
  
  // Common data
  recent_activities: Array<{
    text: string;
    time: string;
    type?: string;
  }>;
}

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

export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await apiClient.get('/dashboard/');
      return response.data;
    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch dashboard data');
    }
  }
}