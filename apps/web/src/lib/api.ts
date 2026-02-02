import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle error globally if needed, e.g. redirect on 401
    if (error.response?.status === 401 && typeof window !== 'undefined') {
         // Optionally redirect to login or clear token
         // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.get<unknown, T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    axiosInstance.post<unknown, T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    axiosInstance.put<unknown, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    axiosInstance.delete<unknown, T>(url, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => 
    axiosInstance.patch<unknown, T>(url, data, config),
};
