import axios from 'axios';

// Backend API configuration
const API_BASE_URL = 'http://localhost:8080/api/accounts';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[Account Service] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Account Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Account Service] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error('[Account Service] Response error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'An error occurred');
  }
);

// Account Service API functions
export class AccountService {
  
  /**
   * Get account by ID
   */
  static async getAccount(accountId) {
    const response = await apiClient.get(`/${accountId}`);
    return response.data;
  }

  /**
   * Get all accounts for a user
   */
  static async getUserAccounts(userId) {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  }

  /**
   * Credit money to account (Deposit)
   */
  static async creditAccount(accountId, request) {
    const response = await apiClient.post(`/${accountId}/credit`, request);
    return response.data;
  }

  /**
   * Debit money from account (Withdrawal)
   */
  static async debitAccount(accountId, request) {
    const response = await apiClient.post(`/${accountId}/debit`, request);
    return response.data;
  }

  /**
   * Get account balance
   */
  static async getAccountBalance(accountId) {
    const response = await apiClient.get(`/${accountId}/balance`);
    return response.data;
  }

  /**
   * Health check
   */
  static async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  }
}

// Utility function to format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export default AccountService; 