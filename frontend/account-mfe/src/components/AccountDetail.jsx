import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Spin, Alert, Divider, Tag, Descriptions } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  AccountService, 
  formatCurrency, 
  getAccountTypeLabel, 
  getAccountStatusLabel, 
  getAccountStatusColor 
} from '../services/accountService';

const { Title, Text } = Typography;

const AccountDetail = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accountId) {
      loadAccount();
    }
  }, [accountId]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accountData = await AccountService.getAccount(accountId);
      setAccount(accountData);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load account details';
      setError(errorMessage);
      console.error('Error loading account:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading account details...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Failed to Load Account"
          description={error}
          type="error"
          showIcon
          action={
            <Space>
              <Button size="small" onClick={() => navigate('/list')}>
                Back to List
              </Button>
              <Button size="small" type="primary" onClick={loadAccount}>
                Retry
              </Button>
            </Space>
          }
        />
      </div>
    );
  }

  if (!account) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Account Not Found"
          description="The requested account could not be found."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/list')}>
              Back to List
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/list')}
          >
            Back to Accounts
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={loadAccount}
          >
            Refresh
          </Button>
        </Space>
      </Card>

      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <BankOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: '0 0 8px 0' }}>Account Details</Title>
          <Text type="secondary">Account Number: {account.accountNumber}</Text>
        </div>

        <Divider />

        <Descriptions 
          title="Account Information" 
          bordered 
          column={2}
          size="middle"
        >
          <Descriptions.Item label="Account ID">
            <Text code>{account.id}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Account Number">
            <Text strong style={{ fontFamily: 'monospace' }}>
              {account.accountNumber}
            </Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Account Type">
            <Tag color="blue">{getAccountTypeLabel(account.accountType)}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Status">
            <Tag color={getAccountStatusColor(account.status)}>
              {getAccountStatusLabel(account.status)}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Current Balance">
            <Text 
              strong 
              style={{ 
                fontSize: '18px',
                color: account.balance >= 0 ? '#52c41a' : '#f5222d' 
              }}
            >
              {formatCurrency(account.balance, account.currency)}
            </Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Currency">
            <Tag>{account.currency}</Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="User ID">
            <Text code>{account.userId}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Created Date">
            {new Date(account.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Descriptions.Item>
          
          {account.updatedAt && (
            <Descriptions.Item label="Last Updated" span={2}>
              {new Date(account.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              onClick={() => {
                // In a real app, this would open a transaction modal
                console.log('Transaction functionality not implemented yet');
              }}
            >
              Make Transaction
            </Button>
            <Button 
              size="large"
              onClick={() => navigate('/list')}
            >
              Back to List
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default AccountDetail; 