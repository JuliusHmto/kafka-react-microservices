class NotificationService {
  constructor() {
    this.listeners = [];
    this.notifications = [];
    this.connected = false;
    this.simulateRealTimeNotifications();
  }

  // Simulate WebSocket connection for real-time notifications
  simulateRealTimeNotifications() {
    this.connected = true;
    
    // Simulate periodic banking notifications
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        this.generateRandomNotification();
      }
    }, 10000);

    // Initial demo notifications
    setTimeout(() => {
      this.addNotification({
        type: 'transaction',
        severity: 'info',
        title: 'Transaction Completed',
        message: 'Your deposit of $500.00 has been processed successfully.',
        timestamp: new Date(),
        read: false,
        actionable: true,
        metadata: {
          transactionId: 'TXN-' + Date.now(),
          accountNumber: 'ACC-001-5678',
          amount: 500.00
        }
      });
    }, 2000);

    setTimeout(() => {
      this.addNotification({
        type: 'security',
        severity: 'warning',
        title: 'Security Alert',
        message: 'New device login detected from Chrome on Windows.',
        timestamp: new Date(),
        read: false,
        actionable: true,
        metadata: {
          device: 'Chrome Browser',
          location: 'New York, NY',
          ipAddress: '192.168.1.100'
        }
      });
    }, 5000);
  }

  // Generate random banking notifications for demo
  generateRandomNotification() {
    const notificationTypes = [
      {
        type: 'transaction',
        severity: 'success',
        title: 'Payment Received',
        message: 'You received a payment of $1,250.00 from John Doe.',
        metadata: { amount: 1250.00, sender: 'John Doe' }
      },
      {
        type: 'account',
        severity: 'info',
        title: 'Monthly Statement Ready',
        message: 'Your January statement is now available for download.',
        metadata: { accountType: 'Checking', month: 'January' }
      },
      {
        type: 'security',
        severity: 'error',
        title: 'Failed Login Attempt',
        message: 'Multiple failed login attempts detected. Account temporarily locked.',
        metadata: { attempts: 5, location: 'Unknown' }
      },
      {
        type: 'promotional',
        severity: 'info',
        title: 'New Investment Opportunity',
        message: 'Explore our high-yield savings account with 4.5% APY.',
        metadata: { product: 'High-Yield Savings', rate: '4.5%' }
      },
      {
        type: 'system',
        severity: 'warning',
        title: 'Scheduled Maintenance',
        message: 'Mobile banking will be unavailable on Sunday 2-4 AM for maintenance.',
        metadata: { service: 'Mobile Banking', duration: '2 hours' }
      }
    ];

    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    this.addNotification({
      ...randomNotification,
      timestamp: new Date(),
      read: false,
      actionable: Math.random() > 0.5
    });
  }

  // Add notification to the system
  addNotification(notification) {
    const newNotification = {
      id: 'NOTIF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      ...notification,
      timestamp: notification.timestamp || new Date()
    };

    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();
    
    // Show browser notification if permission granted
    this.showBrowserNotification(newNotification);
    
    return newNotification;
  }

  // Show browser notification
  showBrowserNotification(notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotif = new Notification(`SecureBank - ${notification.title}`, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.severity === 'error'
      });

      setTimeout(() => {
        browserNotif.close();
      }, 5000);
    }
  }

  // Request browser notification permission
  async requestPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Subscribe to notification updates
  subscribe(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.notifications);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  // Get all notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Get unread notifications
  getUnreadNotifications() {
    return this.notifications.filter(notif => !notif.read);
  }

  // Get unread count
  getUnreadCount() {
    return this.getUnreadNotifications().length;
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.notifyListeners();
  }

  // Delete notification
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get notifications by type
  getNotificationsByType(type) {
    return this.notifications.filter(n => n.type === type);
  }

  // Get notifications by severity
  getNotificationsBySeverity(severity) {
    return this.notifications.filter(n => n.severity === severity);
  }

  // Filter notifications
  filterNotifications(filters = {}) {
    let filtered = [...this.notifications];

    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    if (filters.severity && filters.severity !== 'all') {
      filtered = filtered.filter(n => n.severity === filters.severity);
    }

    if (filters.read !== undefined) {
      filtered = filtered.filter(n => n.read === filters.read);
    }

    if (filters.actionable !== undefined) {
      filtered = filtered.filter(n => n.actionable === filters.actionable);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      filtered = filtered.filter(n => {
        const notifDate = new Date(n.timestamp);
        return notifDate >= start && notifDate <= end;
      });
    }

    return filtered;
  }

  // Get connection status
  isConnected() {
    return this.connected;
  }

  // Simulate connection issues for demo
  simulateConnectionIssue() {
    this.connected = false;
    setTimeout(() => {
      this.connected = true;
      this.addNotification({
        type: 'system',
        severity: 'success',
        title: 'Connection Restored',
        message: 'Real-time notifications are now working properly.',
        timestamp: new Date(),
        read: false
      });
    }, 3000);
  }
}

// Export singleton instance
export default new NotificationService(); 