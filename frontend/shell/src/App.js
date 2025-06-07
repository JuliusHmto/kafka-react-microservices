import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load microfrontends with fallbacks
const AccountManagement = React.lazy(() =>
  import('accountMfe/AccountManagement').catch(() => ({
    default: () => (
      <div className="banking-card">
        <h3>Account Management</h3>
        <p>Account management service is currently unavailable. Please try again later.</p>
      </div>
    )
  }))
);

const TransactionHistory = React.lazy(() =>
  import('transactionMfe/TransactionHistory').catch(() => ({
    default: () => (
      <div className="banking-card">
        <h3>Transaction History</h3>
        <p>Transaction service is currently unavailable. Please try again later.</p>
      </div>
    )
  }))
);

const NotificationCenter = React.lazy(() =>
  import('notificationMfe/NotificationCenter').catch(() => ({
    default: () => (
      <div className="banking-card">
        <h3>Notification Center</h3>
        <p>Notification service is currently unavailable. Please try again later.</p>
      </div>
    )
  }))
);

const DashboardMfe = React.lazy(() =>
  import('dashboardMfe/Dashboard').catch(() => ({
    default: () => null // Dashboard is handled locally
  }))
);

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 8,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <div className="app-layout">
          <Header />
          <main className="app-content">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route 
                  path="/accounts/*" 
                  element={
                    <Suspense fallback={<LoadingFallback message="Loading Account Management..." />}>
                      <AccountManagement />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/transactions/*" 
                  element={
                    <Suspense fallback={<LoadingFallback message="Loading Transaction History..." />}>
                      <TransactionHistory />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/notifications/*" 
                  element={
                    <Suspense fallback={<LoadingFallback message="Loading Notification Center..." />}>
                      <NotificationCenter />
                    </Suspense>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    <div className="banking-card fade-in">
                      <h2>Page Not Found</h2>
                      <p>The requested page could not be found.</p>
                    </div>
                  } 
                />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App; 