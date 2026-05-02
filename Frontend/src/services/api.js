import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
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

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Project APIs
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getAllProjects: () => api.get('/projects'),
  getProjectById: (projectId) => api.get(`/projects/${projectId}`),
  updateProject: (projectId, data) => api.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
  addTeamMember: (projectId, data) => api.post(`/projects/${projectId}/members`, data),
  removeTeamMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
};

// Task APIs
export const taskAPI = {
  createTask: (projectId, data) => api.post(`/tasks/${projectId}/tasks`, data),
  getTasksByProject: (projectId, filters) => api.get(`/tasks/${projectId}/tasks`, { params: filters }),
  getTaskById: (taskId) => api.get(`/tasks/task/${taskId}`),
  updateTask: (taskId, data) => api.put(`/tasks/task/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/tasks/task/${taskId}`),
  assignTask: (taskId, data) => api.post(`/tasks/task/${taskId}/assign`, data),
  unassignTask: (taskId, userId) => api.delete(`/tasks/task/${taskId}/assign/${userId}`),
  addComment: (taskId, data) => api.post(`/tasks/task/${taskId}/comment`, data),
  getOverdueTasks: () => api.get('/tasks/user/overdue-tasks'),
};

// Team APIs
export const teamAPI = {
  createTeam: (data) => api.post('/teams', data),
  getAllTeams: () => api.get('/teams'),
  getTeamById: (teamId) => api.get(`/teams/${teamId}`),
  updateTeam: (teamId, data) => api.put(`/teams/${teamId}`, data),
  deleteTeam: (teamId) => api.delete(`/teams/${teamId}`),
  addTeamMember: (teamId, data) => api.post(`/teams/${teamId}/members`, data),
  removeTeamMember: (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`),
  addProjectToTeam: (teamId, data) => api.post(`/teams/${teamId}/projects`, data),
  getDashboardStats: () => api.get('/teams/user/dashboard-stats'),
};

export default api;
