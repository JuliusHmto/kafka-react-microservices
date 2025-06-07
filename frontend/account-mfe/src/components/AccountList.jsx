import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Alert, Button, Table, Tag, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AccountService, formatCurrency, getAccountTypeLabel, getAccountStatusLabel, getAccountStatusColor } from '../services/accountService';

const { Title, Text } = Typography;

// Demo user ID for testing
const DEMO_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const AccountList = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if backend is healthy
      await AccountService.healthCheck();
      
      // Load accounts for demo user
      const userAccounts = await AccountService.getUserAccounts(DEMO_USER_ID);
      setAccounts(userAccounts);
    } catch (err) {
      const errorMessage = err.message || 'Failed to load accounts';
      setError(errorMessage);
      console.error('Error loading accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (accountNumber) => (
        <Text strong style={{ fontFamily: 'monospace' }}>
          {accountNumber}
        </Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'accountType',
      render: (type) => (
        <Tag color="blue">{getAccountTypeLabel(type)}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getAccountStatusColor(status)}>
          {getAccountStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance, record) => (
        <Text strong style={{ color: balance >= 0 ? '#52c41a' : '#f5222d' }}>
          {formatCurrency(balance, record.currency)}
        </Text>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Loading accounts...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="Failed to Load Accounts"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={loadAccounts}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Customer Accounts</Title>
            <Text type="secondary">Total: {accounts.length} accounts</Text>
          </div>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadAccounts}
              loading={loading}
            >
              Refresh
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/create')}
            >
              Create Account
            </Button>
          </Space>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} accounts`,
          }}
        />
      </Card>
    </div>
  );
};

export default AccountList; 