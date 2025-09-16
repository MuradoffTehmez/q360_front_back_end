// evaluationsService.ts
import axios from 'axios';
import { User } from './AuthService';

const API_BASE_URL = 'http://localhost:8000/api/evaluations';

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

export interface EvaluationCycle {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_anonymous: boolean;
  allow_self_evaluation: boolean;
  allow_peer_evaluation: boolean;
  allow_manager_evaluation: boolean;
  created_at: string;
  updated_at: string;
}

export interface Competency {
  id: number;
  name: string;
  description: string;
  department: any;
  order: number;
}

export interface Question {
  id: number;
  competency: Competency;
  text: string;
  order: number;
}

export interface Answer {
  id: number;
  evaluation: number;
  question: Question;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: number;
  cycle: EvaluationCycle;
  evaluatee: User;
  evaluator: User;
  evaluation_type: 'self' | 'peer' | 'manager';
  submitted_at: string | null;
  is_submitted: boolean;
  created_at: string;
  updated_at: string;
  answers: Answer[];
}

export class EvaluationsService {
  static async getEvaluations(): Promise<Evaluation[]> {
    try {
      const response = await apiClient.get('/evaluations/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching evaluations:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch evaluations');
    }
  }

  static async getEvaluation(id: number): Promise<Evaluation> {
    try {
      const response = await apiClient.get(`/evaluations/${id}/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching evaluation:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch evaluation');
    }
  }

  static async getEvaluationQuestions(evaluationId: number): Promise<Question[]> {
    try {
      const response = await apiClient.get(`/evaluations/${evaluationId}/get_questions/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching evaluation questions:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch evaluation questions');
    }
  }

  static async getEvaluationAnswers(evaluationId: number): Promise<Answer[]> {
    try {
      const response = await apiClient.get(`/evaluations/${evaluationId}/get_answers/`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching evaluation answers:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to fetch evaluation answers');
    }
  }

  static async saveDraft(evaluationId: number, answers: Partial<Answer>[]): Promise<Evaluation> {
    try {
      const response = await apiClient.post(`/evaluations/${evaluationId}/save_draft/`, {
        answers
      });
      return response.data.evaluation;
    } catch (error: any) {
      console.error('Error saving draft:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to save draft');
    }
  }

  static async submitEvaluation(evaluationId: number): Promise<void> {
    try {
      await apiClient.post(`/evaluations/${evaluationId}/submit/`);
    } catch (error: any) {
      console.error('Error submitting evaluation:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to submit evaluation');
    }
  }
}