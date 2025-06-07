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

// Account Types
export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  BUSINESS: 'BUSINESS',
  JOINT: 'JOINT',
  STUDENT: 'STUDENT',
  PREMIUM: 'PREMIUM'
};

// Account Status
export const AccountStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED',
  FROZEN: 'FROZEN'
};

// Account Service API functions
export class AccountService {
  
  /**
   * Create a new bank account
   */
  static async createAccount(request) {
    const response = await apiClient.post('', request);
    return response.data;
  }

  /**
   * Get account by ID
   */
  static async getAccount(accountId) {
    const response = await apiClient.get(`/${accountId}`);
    return response.data;
  }

  /**
   * Get account by account number
   */
  static async getAccountByNumber(accountNumber) {
    const response = await apiClient.get(`/number/${accountNumber}`);
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

// Utility functions
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const getAccountTypeLabel = (type) => {
  const labels = {
    [AccountType.CHECKING]: 'Checking Account',
    [AccountType.SAVINGS]: 'Savings Account',
    [AccountType.BUSINESS]: 'Business Account',
    [AccountType.JOINT]: 'Joint Account',
    [AccountType.STUDENT]: 'Student Account',
    [AccountType.PREMIUM]: 'Premium Account',
  };
  return labels[type];
};

export const getAccountStatusLabel = (status) => {
  const labels = {
    [AccountStatus.PENDING]: 'Pending Activation',
    [AccountStatus.ACTIVE]: 'Active',
    [AccountStatus.SUSPENDED]: 'Suspended',
    [AccountStatus.CLOSED]: 'Closed',
    [AccountStatus.FROZEN]: 'Frozen',
  };
  return labels[status];
};

// Status color mapping for UI
export const getAccountStatusColor = (status) => {
  const colors = {
    [AccountStatus.PENDING]: 'orange',
    [AccountStatus.ACTIVE]: 'green',
    [AccountStatus.SUSPENDED]: 'red',
    [AccountStatus.CLOSED]: 'default',
    [AccountStatus.FROZEN]: 'blue',
  };
  return colors[status];
};

export default AccountService; 