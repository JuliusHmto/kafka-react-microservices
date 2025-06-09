import axios from 'axios';

// Backend API configuration
const TRANSACTION_API_BASE_URL = 'http://localhost:8081/api/transactions';

// Configure axios instance
const apiClient = axios.create({
  baseURL: TRANSACTION_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[Transaction Service] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[Transaction Service] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[Transaction Service] Response:`, response.data);
    return response;
  },
  (error) => {
    console.error('[Transaction Service] Response error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || error.message || 'An error occurred');
  }
);

// Transaction Service API functions
export class TransactionService {
  
  /**
   * Get transaction history for a user
   */
  static async getUserTransactions(userId, page = 0, size = 10) {
    const response = await apiClient.get(`/user/${userId}?page=${page}&size=${size}&sort=createdAt,desc`);
    return response.data;
  }

  /**
   * Get transaction by ID
   */
  static async getTransaction(transactionId) {
    const response = await apiClient.get(`/${transactionId}`);
    return response.data;
  }

  /**
   * Get transactions for a specific account
   */
  static async getAccountTransactions(accountId, page = 0, size = 10) {
    const response = await apiClient.get(`/account/${accountId}?page=${page}&size=${size}&sort=createdAt,desc`);
    return response.data;
  }

  /**
   * Create a new transaction
   */
  static async createTransaction(request) {
    const response = await apiClient.post('', request);
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

// Transaction type mapping
export const TransactionType = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  TRANSFER: 'TRANSFER',
  PAYMENT: 'PAYMENT',
  REFUND: 'REFUND'
};

// Transaction status mapping
export const TransactionStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REVERSED: 'REVERSED'
};

// Get transaction type label
export const getTransactionTypeLabel = (type) => {
  const labels = {
    [TransactionType.DEPOSIT]: 'Deposit',
    [TransactionType.WITHDRAWAL]: 'Withdrawal', 
    [TransactionType.TRANSFER]: 'Transfer',
    [TransactionType.PAYMENT]: 'Payment',
    [TransactionType.REFUND]: 'Refund'
  };
  return labels[type] || type;
};

// Get transaction status label
export const getTransactionStatusLabel = (status) => {
  const labels = {
    [TransactionStatus.PENDING]: 'Pending',
    [TransactionStatus.PROCESSING]: 'Processing',
    [TransactionStatus.COMPLETED]: 'Completed',
    [TransactionStatus.FAILED]: 'Failed',
    [TransactionStatus.CANCELLED]: 'Cancelled',
    [TransactionStatus.REVERSED]: 'Reversed'
  };
  return labels[status] || status;
};

// Status color mapping for UI
export const getTransactionStatusColor = (status) => {
  const colors = {
    [TransactionStatus.PENDING]: 'orange',
    [TransactionStatus.PROCESSING]: 'blue',
    [TransactionStatus.COMPLETED]: 'green',
    [TransactionStatus.FAILED]: 'red',
    [TransactionStatus.CANCELLED]: 'default',
    [TransactionStatus.REVERSED]: 'purple'
  };
  return colors[status] || 'default';
};

export default TransactionService; 