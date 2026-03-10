/**
 * API Client for making HTTP requests
 * TODO: Replace with real API implementation
 */

import { API_BASE_URL, API_TIMEOUT, ERROR_MESSAGES } from "./constants";
import type { Session } from "@/types";

interface RequestOptions extends RequestInit {
  timeout?: number;
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultTimeout = API_TIMEOUT;
  }

  private async getSession(): Promise<Session | null> {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("session");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await this.getSession();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (session?.token) {
      headers.Authorization = `Bearer ${session.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      requireAuth = true,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...headers,
          ...fetchOptions.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: ERROR_MESSAGES.SERVER_ERROR,
        }));
        throw new Error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        throw error;
      }

      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

