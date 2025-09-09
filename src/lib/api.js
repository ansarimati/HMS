'use client';

import { tokenManager } from './auth';

class ApiClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  }

  // ✨ NEW: Get headers with JWT token
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders
    };

    // Add JWT token if available
    const token = tokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // ✨ NEW: Handle API responses with error handling
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    if (!response.ok) {
      let errorData;
      
      if (isJson) {
        errorData = await response.json();
      } else {
        errorData = { error: 'An error occurred' };
      }

      // Handle authentication errors
      if (response.status === 401) {
        // Token expired or invalid - redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error(errorData.error || 'Authentication required');
      }

      // Handle authorization errors
      if (response.status === 403) {
        throw new Error(errorData.error || 'Access denied');
      }

      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return isJson ? await response.json() : await response.text();
  }

  // ✨ NEW: Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.headers),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API request failed: ${options.method || 'GET'} ${endpoint}`, error);
      throw error;
    }
  }

  // ✨ NEW: HTTP method shortcuts
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint, data = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // ✨ NEW: Upload file with JWT
  async uploadFile(endpoint, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);

    const headers = {};
    const token = tokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

// ✨ NEW: Specific API methods for your app
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

export const patientAPI = {
  getPatients: (params) => api.get(`/api/patients?${new URLSearchParams(params)}`),
  getPatient: (id) => api.get(`/api/patients/${id}`),
  createPatient: (data) => api.post('/api/patients', data),
  updatePatient: (id, data) => api.put(`/api/patients/${id}`, data),
  deletePatient: (id) => api.delete(`/api/patients/${id}`),
};

export const appointmentAPI = {
  getAppointments: (params) => api.get(`/api/appointments?${new URLSearchParams(params)}`),
  createAppointment: (data) => api.post('/api/appointments', data),
  updateAppointment: (id, data) => api.put(`/api/appointments/${id}`, data),
  cancelAppointment: (id) => api.delete(`/api/appointments/${id}`),
};