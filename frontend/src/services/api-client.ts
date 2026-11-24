import { ApiResponse, HealthResponse, TaskItem } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data: ApiResponse<T> = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to communicate with API server",
      data: null,
      errors: error,
    };
  }
}

export const api = {
  getHealth: () => request<HealthResponse>("/health"),
  listTasks: () => request<TaskItem[]>("/tasks"),
  createTask: (title: string, payload: Record<string, any> = {}) =>
    request<TaskItem>("/tasks", {
      method: "POST",
      body: JSON.stringify({ title, payload }),
    }),
  getTask: (taskId: string) => request<TaskItem>(`/tasks/${taskId}`),
};
