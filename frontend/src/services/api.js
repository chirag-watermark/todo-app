import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error: Backend server is not running. Please start the Rails server.');
    }
    return Promise.reject(error);
  }
);

export const todoAPI = {
  // Get all todos
  getAllTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get a single todo
  getTodo: async (id) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todoData) => {
    try {
      const response = await api.post('/todos', todoData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (id, todoData) => {
    try {
      const response = await api.put(`/todos/${id}`, todoData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },
};

export default api; 