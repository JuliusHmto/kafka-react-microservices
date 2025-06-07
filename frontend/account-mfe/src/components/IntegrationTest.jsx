import React, { useState } from 'react';
import { Card, Button, Space, Typography, Alert, Spin, Divider } from 'antd';
import { 
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  DatabaseOutlined,
  ApiOutlined,
  BankOutlined
} from '@ant-design/icons';
import { AccountService, AccountType } from '../services/accountService';

const { Title, Text, Paragraph } = Typography;

// Demo user ID for testing
const DEMO_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const IntegrationTest = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const createSampleAccounts = async () => {
    console.log('🏦 Creating sample accounts for testing...');

    // Check if backend is healthy first
    const health = await AccountService.healthCheck();
    console.log('✅ Backend health check:', health);

    const accountTypes = [
      AccountType.CHECKING,
      AccountType.SAVINGS,
      AccountType.BUSINESS,
      AccountType.STUDENT
    ];

    const createdAccounts = [];

    for (const accountType of accountTypes) {
      try {
        const request = {
          userId: DEMO_USER_ID,
          accountType: accountType
        };

        const account = await AccountService.createAccount(request);
        console.log(`✅ Created ${accountType} account:`, account.accountNumber);
        createdAccounts.push(account);

        // Add some initial balance to make it more realistic
        if (account.id) {
          const depositAmount = Math.floor(Math.random() * 5000) + 1000;
          await AccountService.creditAccount(account.id, {
            amount: depositAmount,
            currency: 'USD',
            description: 'Initial deposit for testing'
          });
          console.log(`💰 Added $${depositAmount} to ${account.accountNumber}`);
        }

        // Small delay to avoid overwhelming the backend
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.warn(`⚠️ Could not create ${accountType} account:`, error);
      }
    }

    console.log(`🎉 Successfully created ${createdAccounts.length} sample accounts!`);
    return createdAccounts;
  };

  const runFullTest = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // 1. Health check
      const health = await AccountService.healthCheck();
      console.log('✅ Health check passed:', health);

      // 2. Get existing accounts
      const existingAccounts = await AccountService.getUserAccounts(DEMO_USER_ID);
      console.log(`📊 Found ${existingAccounts.length} existing accounts`);

      // 3. Create sample accounts if none exist
      let createdAccounts = [];
      if (existingAccounts.length === 0) {
        createdAccounts = await createSampleAccounts();
      }

      // 4. Final account check
      const finalAccounts = await AccountService.getUserAccounts(DEMO_USER_ID);
      console.log(`🏁 Final account count: ${finalAccounts.length}`);
      
      setTestResults([{
        success: true,
        message: 'Integration test completed successfully!',
        details: `Created ${createdAccounts.length} new accounts. Total accounts: ${finalAccounts.length}. Check browser console for detailed logs.`
      }]);

    } catch (error) {
      setTestResults([{
        success: false,
        message: 'Integration test failed with error',
        details: error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const runCreateAccounts = async () => {
    setLoading(true);
    
    try {
      const accounts = await createSampleAccounts();
      setTestResults([{
        success: true,
        message: `Successfully created ${accounts.length} sample accounts`,
        details: 'Sample accounts have been created with initial balances. You can now view them in the account list.'
      }]);
    } catch (error) {
      setTestResults([{
        success: false,
        message: 'Failed to create sample accounts',
        details: error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  const testHealthCheck = async () => {
    setLoading(true);
    
    try {
      const health = await AccountService.healthCheck();
      setTestResults([{
        success: true,
        message: 'Backend health check passed!',
        details: `Service: ${health.service}, Status: ${health.status}`
      }]);
    } catch (error) {
      setTestResults([{
        success: false,
        message: 'Backend health check failed',
        details: error.message
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <ApiOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2}>Backend Integration Test</Title>
          <Paragraph type="secondary">
            Test the connection between the React frontend and Java backend account service.
            Make sure your backend service is running on <code>localhost:8080</code>.
          </Paragraph>
        </div>

        <Divider />

        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>🔧 Prerequisites</Title>
          <ul>
            <li>✅ Account Service running on <code>http://localhost:8080</code></li>
            <li>✅ PostgreSQL database connected and initialized</li>
            <li>✅ Kafka cluster running (for event publishing)</li>
            <li>✅ Frontend account-mfe running on <code>http://localhost:3001</code></li>
          </ul>
        </div>

        <Divider />

        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>🧪 Test Actions</Title>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            
            <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
              <Space>
                <PlayCircleOutlined style={{ color: '#52c41a' }} />
                <div style={{ flex: 1 }}>
                  <Text strong>Full Integration Test</Text>
                  <br />
                  <Text type="secondary">
                    Runs complete test: health check, account creation, transactions
                  </Text>
                </div>
                <Button 
                  type="primary" 
                  onClick={runFullTest}
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  Run Full Test
                </Button>
              </Space>
            </Card>

            <Card size="small" style={{ backgroundColor: '#f0f5ff' }}>
              <Space>
                <BankOutlined style={{ color: '#1890ff' }} />
                <div style={{ flex: 1 }}>
                  <Text strong>Create Sample Accounts</Text>
                  <br />
                  <Text type="secondary">
                    Creates 4 different account types with initial balances
                  </Text>
                </div>
                <Button 
                  onClick={runCreateAccounts}
                  loading={loading}
                  icon={<BankOutlined />}
                >
                  Create Accounts
                </Button>
              </Space>
            </Card>

            <Card size="small" style={{ backgroundColor: '#fff7e6' }}>
              <Space>
                <DatabaseOutlined style={{ color: '#fa8c16' }} />
                <div style={{ flex: 1 }}>
                  <Text strong>Health Check</Text>
                  <br />
                  <Text type="secondary">
                    Tests backend connectivity and service status
                  </Text>
                </div>
                <Button 
                  onClick={testHealthCheck}
                  loading={loading}
                  icon={<DatabaseOutlined />}
                >
                  Test Health
                </Button>
              </Space>
            </Card>

          </Space>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>Running integration test... Check browser console for detailed logs.</Text>
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <Title level={4}>📊 Test Results</Title>
            {testResults.map((result, index) => (
              <Alert
                key={index}
                message={result.message}
                description={result.details}
                type={result.success ? 'success' : 'error'}
                icon={result.success ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                showIcon
                style={{ marginBottom: '8px' }}
              />
            ))}
          </div>
        )}

        <Divider />

        <div style={{ backgroundColor: '#f6ffed', padding: '16px', borderRadius: '6px' }}>
          <Title level={5} style={{ color: '#52c41a', margin: '0 0 8px 0' }}>
            💡 Next Steps
          </Title>
          <ul style={{ margin: 0, color: '#666' }}>
            <li>After running tests, navigate to <strong>/list</strong> to see created accounts</li>
            <li>Try creating new accounts using <strong>/create</strong></li>
            <li>Test deposit and withdrawal operations from the account list</li>
            <li>Monitor the backend logs to see Kafka events being published</li>
          </ul>
        </div>

      </Card>
    </div>
  );
};

export default IntegrationTest; 