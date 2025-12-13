import axios from 'axios';

// Base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cinedev-popcornping.hf.space';

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  withCredentials: true
});

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // CRITICAL: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ API Response Error: ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  googleLogin: () => {
    const googleAuthUrl = `${API_BASE_URL}/api/auth/google`;
    console.log('🔗 Redirecting to Google OAuth:', googleAuthUrl);
    window.location.href = googleAuthUrl;
  },
};

export const roomAPI = {
  createRoom: (data) => api.post('/rooms/create', data),
  getRoom: (roomId) => api.get(`/rooms/${roomId}`),
  joinRoom: (roomId) => api.post(`/rooms/${roomId}/join`),
  endRoom: (roomId) => api.post(`/rooms/${roomId}/end`),
  getUserRooms: () => api.get('/rooms/user/rooms'),
};

export default api;
