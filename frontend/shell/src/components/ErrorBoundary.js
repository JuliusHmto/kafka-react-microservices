import React from 'react';
import { Alert, Button } from 'antd';
import { ReloadOutlined, BugOutlined } from '@ant-design/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log the error to monitoring service
    console.error('Banking Portal Error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="banking-card fade-in" style={{ textAlign: 'center', padding: '48px' }}>
          <BugOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '24px' }} />
          
          <h2>Something went wrong</h2>
          <p style={{ color: '#8c8c8c', marginBottom: '24px' }}>
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>

          <Alert
            message="Error Details"
            description={
              <div style={{ textAlign: 'left' }}>
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}<br/>
                <strong>Component Stack:</strong> {this.state.errorInfo.componentStack}
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: '24px', textAlign: 'left' }}
          />

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button 
              type="primary" 
              icon={<ReloadOutlined />}
              onClick={this.handleRetry}
            >
              Try Again
            </Button>
            <Button 
              icon={<ReloadOutlined />}
              onClick={this.handleReload}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 