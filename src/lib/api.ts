// API configuration and base fetch setup

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  },
  
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  },
};

