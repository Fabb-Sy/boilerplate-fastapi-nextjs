export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors: any | null;
}

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
}

export type TaskStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface TaskItem {
  id: string;
  title: string;
  status: TaskStatus;
  progress: number;
  result: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
