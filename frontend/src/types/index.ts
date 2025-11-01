/**
 * Type definitions for Mumbai Civil Budget Portal
 * Matching backend API models
 */

export type ProjectStatus = 
  | 'proposed' 
  | 'tendered' 
  | 'awarded' 
  | 'in_progress' 
  | 'completed' 
  | 'stalled';

export type UpdateType = 'official' | 'citizen' | 'media';

export type ReportStatus = 'pending' | 'published' | 'rejected';

// Geometry types
export interface Point {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface MultiPolygon {
  type: 'MultiPolygon';
  coordinates: number[][][][];
}

export interface Geometry {
  type: string;
  coordinates: any;
}

export interface Ward {
  id: string;
  name: string;
  code: string | null;
  created_at: string;
}

export interface Contractor {
  id: string;
  name: string;
  registration_number: string | null;
  address: string | null;
  contact_info: Record<string, any> | null;
  created_at: string;
}

export interface ProjectSummary {
  id: string;
  title: string;
  description?: string | null;
  status: ProjectStatus;
  budget_amount: number | null;
  budget_currency: string | null;
  confidence_score: number | null;
  ward_id: string | null;
  centroid?: Point | null;
  geom?: Geometry | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectDetail extends ProjectSummary {
  external_ids: Record<string, any>;
  start_date: string | null;
  expected_end_date: string | null;
  ward: Ward | null;
  tenders?: Tender[];
  contracts?: Contract[];
  progress_updates?: ProgressUpdate[];
}

// Alias for backward compatibility
export type Project = ProjectSummary;

export interface Tender {
  id: string;
  tender_number: string | null;
  title: string;
  issuing_agency: string | null;
  project_id: string | null;
  tender_value: number | null;
  tender_currency: string;
  publish_date: string | null;
  close_date: string | null;
  award_date: string | null;
  awarded_to: string | null;
  source: Record<string, any> | null;
  created_at: string;
}

export interface Contract {
  id: string;
  project_id: string;
  contractor_id: string;
  tender_id: string | null;
  contract_value: number | null;
  contract_currency: string;
  start_date: string | null;
  completion_date: string | null;
  status: string;
  documents: Record<string, any> | null;
  created_at: string;
  contractor?: Contractor;
}

export interface ProgressUpdate {
  id: string;
  project_id: string;
  update_type: UpdateType;
  title: string | null;
  description: string | null;
  photos: any[] | null;
  reported_at: string | null;
  verified: boolean;
  confidence_score: number;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string | null;
  project_id: string | null;
  title: string;
  description: string | null;
  photos: any[] | null;
  status: ReportStatus;
  created_at: string;
}

export interface Source {
  id: string;
  name: string;
  source_type: string | null;
  url: string | null;
  last_retrieved_at: string | null;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  reputation: number;
  is_active: boolean;
  created_at: string;
}

// Filter types
export interface ProjectFilters {
  q?: string;
  ward_id?: string;
  status?: ProjectStatus;
  min_budget?: number;
  max_budget?: number;
  skip?: number;
  limit?: number;
}

// API Response types
export interface PaginatedResponse<T> {
  total: number;
  skip: number;
  limit: number;
  items: T[];
}

export interface ApiError {
  detail: string;
  status?: number;
}

// Map types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  status: ProjectStatus;
  budget: number | null;
  confidence: number | null;
}

// Form types
export interface ProjectCreateForm {
  title: string;
  description?: string;
  ward_id?: string;
  start_date?: string;
  expected_end_date?: string;
  budget_amount?: number;
}

export interface ReportCreateForm {
  title: string;
  description?: string;
  project_id?: string;
  photos?: File[];
}

export interface CommentCreateForm {
  text: string;
  photos?: File[];
  update_type: UpdateType;
}
