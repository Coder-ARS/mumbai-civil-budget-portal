/**
 * API Client for Mumbai Civic Budget Portal Backend
 * Base URL and axios configuration
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ProjectSummary,
  ProjectDetail,
  ProjectFilters,
  PaginatedResponse,
  Ward,
  Contractor,
  Tender,
  Contract,
  ProgressUpdate,
  Report,
  Source,
  ProjectCreateForm,
  ReportCreateForm,
  ApiError,
  Comment,
  CommentCreateData,
  DashboardStats,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        const apiError: ApiError = {
          detail: error.response?.data?.detail || error.message || 'An error occurred',
          status: error.response?.status,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Projects
  async getProjects(filters?: ProjectFilters): Promise<PaginatedResponse<ProjectSummary>> {
    const { data } = await this.client.get('/projects', { params: filters });
    return data;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await this.client.get('/projects/stats/dashboard');
    return data;
  }

  async getProject(id: string): Promise<ProjectDetail> {
    const { data } = await this.client.get(`/projects/${id}`);
    return data;
  }

  async createProject(project: ProjectCreateForm): Promise<ProjectDetail> {
    const { data } = await this.client.post('/projects', project);
    return data;
  }

  async updateProject(id: string, updates: Partial<ProjectCreateForm>): Promise<ProjectDetail> {
    const { data } = await this.client.put(`/projects/${id}`, updates);
    return data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  // Wards
  async getWards(skip = 0, limit = 100): Promise<Ward[]> {
    const { data } = await this.client.get('/wards', { params: { skip, limit } });
    return data;
  }

  async getWard(id: string): Promise<Ward> {
    const { data } = await this.client.get(`/wards/${id}`);
    return data;
  }

  // Contractors
  async getContractors(q?: string, skip = 0, limit = 50): Promise<Contractor[]> {
    const { data } = await this.client.get('/contractors', { params: { q, skip, limit } });
    return data;
  }

  async getContractor(id: string): Promise<Contractor> {
    const { data } = await this.client.get(`/contractors/${id}`);
    return data;
  }

  // Tenders
  async getTenders(projectId?: string, skip = 0, limit = 50): Promise<Tender[]> {
    const { data } = await this.client.get('/tenders', {
      params: { project_id: projectId, skip, limit },
    });
    return data;
  }

  async getTender(id: string): Promise<Tender> {
    const { data } = await this.client.get(`/tenders/${id}`);
    return data;
  }

  // Contracts
  async getContracts(projectId?: string, skip = 0, limit = 50): Promise<Contract[]> {
    const { data } = await this.client.get('/contracts', {
      params: { project_id: projectId, skip, limit },
    });
    return data;
  }

  async getContract(id: string): Promise<Contract> {
    const { data } = await this.client.get(`/contracts/${id}`);
    return data;
  }

  // Progress Updates
  async getProgressUpdates(projectId: string, skip = 0, limit = 50): Promise<ProgressUpdate[]> {
    const { data } = await this.client.get('/progress-updates', {
      params: { project_id: projectId, skip, limit },
    });
    return data;
  }

  async createProgressUpdate(update: {
    project_id: string;
    update_type: string;
    title?: string;
    description?: string;
    photos?: any[];
  }): Promise<ProgressUpdate> {
    const { data } = await this.client.post('/progress-updates', update);
    return data;
  }

  // Reports
  async getReports(status?: string, skip = 0, limit = 50): Promise<Report[]> {
    const { data } = await this.client.get('/reports', {
      params: { status, skip, limit },
    });
    return data;
  }

  async createReport(report: ReportCreateForm): Promise<Report> {
    const { data } = await this.client.post('/reports', report);
    return data;
  }

  // Comments
  async getProjectComments(projectId: string, skip = 0, limit = 100): Promise<Comment[]> {
    const { data } = await this.client.get(`/projects/${projectId}/comments`, {
      params: { skip, limit },
    });
    return data;
  }

  async createComment(projectId: string, commentData: CommentCreateData): Promise<Comment> {
    const { data } = await this.client.post(`/projects/${projectId}/comments`, commentData);
    return data;
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.client.delete(`/projects/comments/${commentId}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    const { data } = await this.client.get(`${API_BASE_URL}/health`);
    return data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
