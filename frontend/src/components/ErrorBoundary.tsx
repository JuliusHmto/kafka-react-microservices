import React from 'react';
import { Alert, Button, Result } from 'antd';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return (
        <div style={{ padding: '40px 20px' }}>
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An error occurred while loading this module. Please try again."
            extra={[
              <Button type="primary" onClick={this.resetError} key="retry">
                Try Again
              </Button>,
              <Button onClick={() => window.location.reload()} key="reload">
                Reload Page
              </Button>,
            ]}
          />
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Alert
              message="Error Details (Development Mode)"
              description={
                <div>
                  <p><strong>Error:</strong> {this.state.error.message}</p>
                  <p><strong>Stack:</strong></p>
                  <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p><strong>Component Stack:</strong></p>
                      <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              }
              type="error"
              showIcon
              style={{ marginTop: '20px', textAlign: 'left' }}
            />
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 