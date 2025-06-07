import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load microfrontends
const AccountMfe = React.lazy(() => import('accountMfe/AccountApp'));
const TransactionMfe = React.lazy(() => import('transactionMfe/TransactionApp'));
const NotificationMfe = React.lazy(() => import('notificationMfe/NotificationApp'));

const { Content } = Layout;

const LoadingFallback = () => (
  <div className="loading-container">
    <Spin size="large" className="loading-spinner" />
    <div>Loading module...</div>
  </div>
);

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sidebar />
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: '24px',
              background: '#fff',
              borderRadius: '8px',
              minHeight: 'calc(100vh - 112px)',
            }}
          >
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Account Management Microfrontend */}
                <Route
                  path="/accounts/*"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <AccountMfe />
                    </Suspense>
                  }
                />
                
                {/* Transaction Management Microfrontend */}
                <Route
                  path="/transactions/*"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <TransactionMfe />
                    </Suspense>
                  }
                />
                
                {/* Notification Management Microfrontend */}
                <Route
                  path="/notifications/*"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <NotificationMfe />
                    </Suspense>
                  }
                />
                
                {/* Fallback route */}
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </ErrorBoundary>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App; 