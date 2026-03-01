import axios from 'axios';

const API_GATEWAY_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Catalog Service
export const catalogAPI = {
  getProducts: (params) => apiClient.get('/catalog/products', { params }),
  getProduct: (id) => apiClient.get(`/catalog/products/${id}`),
  searchProducts: (query) => apiClient.get(`/catalog/search`, { params: { q: query } }),
  getCategories: () => apiClient.get('/catalog/categories'),
};

// Auth Service
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (userData) => apiClient.put('/auth/profile', userData),
};

// Cart Service
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addItem: (productId, quantity) => apiClient.post('/cart/add', { productId, quantity }),
  removeItem: (productId) => apiClient.delete(`/cart/item/${productId}`),
  updateQuantity: (productId, quantity) => apiClient.put(`/cart/item/${productId}`, { quantity }),
  clearCart: () => apiClient.delete('/cart'),
};

// Orders Service
export const ordersAPI = {
  getOrders: (params) => apiClient.get('/orders', { params }),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  updateOrder: (id, data) => apiClient.put(`/orders/${id}`, data),
  cancelOrder: (id) => apiClient.post(`/orders/${id}/cancel`),
};

// Inventory Service
export const inventoryAPI = {
  getStock: (productId) => apiClient.get(`/inventory/${productId}`),
  checkAvailability: (productId, quantity) => apiClient.post('/inventory/check', { productId, quantity }),
};

// Payments Service
export const paymentsAPI = {
  processPayment: (paymentData) => apiClient.post('/payments/charge', paymentData),
  getPaymentMethods: () => apiClient.get('/payments/methods'),
  validatePaymentMethod: (paymentMethodId) => apiClient.get(`/payments/method/${paymentMethodId}`),
};

// Notifications Service
export const notificationsAPI = {
  getNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  deleteNotification: (id) => apiClient.delete(`/notifications/${id}`),
};

// CMS/Strapi API
export const strapiAPI = {
  getProducts: (params) => apiClient.get('/cms/api/products', { params }),
  getCategories: (params) => apiClient.get('/cms/api/categories', { params }),
  getOrders: (params) => apiClient.get('/cms/api/orders', { params }),
};

// Health Checks
export const healthAPI = {
  checkGateway: () => apiClient.get('/health'),
  checkCatalog: () => apiClient.get('/catalog/health'),
  checkAuth: () => apiClient.get('/auth/health'),
  checkCart: () => apiClient.get('/cart/health'),
  checkOrders: () => apiClient.get('/orders/health'),
  checkInventory: () => apiClient.get('/inventory/health'),
};

export default apiClient;
