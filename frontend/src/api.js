import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentification
export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/token', new URLSearchParams(credentials), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getCurrentUser: () => api.get('/users/me'),
};

// Utilisateurs
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (data) => api.put('/users/me', data),
  verify: (userId) => api.post(`/users/${userId}/verify`),
  search: (filters) => api.post('/search', filters),
};

// Compétences
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
};

// Langues
export const languagesAPI = {
  getAll: () => api.get('/languages'),
  create: (data) => api.post('/languages', data),
};

// Projets
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getCollaborationRequests: (projectId) => api.get(`/projects/${projectId}/collaboration-requests`),
};

// Demandes de collaboration
export const collaborationAPI = {
  create: (data) => api.post('/collaboration-requests', data),
  accept: (requestId) => api.put(`/collaboration-requests/${requestId}/accept`),
};

// Carte des talents
export const talentMapAPI = {
  getData: () => api.get('/talent-map'),
};

export default api;
